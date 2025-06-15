from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import secrets

from app.db import schemas
from app.models.produit import Produit
from app.db.database import get_db

router = APIRouter(prefix="/produits", tags=["Produits"])

def generate_id():
    return secrets.token_hex(3)

# ---------------------------
# ENDPOINTS PUBLIC
# ---------------------------

@router.get("/", response_model=List[schemas.ProduitOut])
def get_produits(
    db: Session = Depends(get_db),
    categorie: Optional[str] = None,
    nouveau: Optional[bool] = None,
    promo: Optional[bool] = None,
    min_prix: Optional[float] = Query(None, alias="min-prix"),
    max_prix: Optional[float] = Query(None, alias="max-prix"),
    limit: int = 100,
    offset: int = 0
):
    """
    Récupère les produits avec filtres :
    - Par catégorie
    - Produits nouveaux
    - Produits en promo
    - Fourchette de prix
    """
    query = db.query(Produit)
    
    if categorie:
        query = query.filter(Produit.categorie == categorie)
    if nouveau is not None:
        query = query.filter(Produit.est_nouveau == nouveau)
    if promo is not None:
        query = query.filter(Produit.promotion.isnot(None) if promo else Produit.promotion.is_(None))
    if min_prix:
        query = query.filter(Produit.prix >= min_prix)
    if max_prix:
        query = query.filter(Produit.prix <= max_prix)
    
    produits = query.offset(offset).limit(limit).all()
    
    if not produits:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aucun produit trouvé avec ces critères"
        )
    return produits

@router.get("/{produit_id}", response_model=schemas.ProduitOut)
def get_produit(produit_id: str, db: Session = Depends(get_db)):
    """Récupère un produit spécifique par son ID"""
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produit introuvable"
        )
    return produit

@router.get("/categories/liste", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    """Récupère la liste des catégories disponibles"""
    categories = db.query(Produit.categorie).distinct().all()
    return [cat[0] for cat in categories]

# ---------------------------
# ENDPOINTS ADMIN
# ---------------------------

@router.post("/", response_model=schemas.ProduitOut, status_code=status.HTTP_201_CREATED)
def create_produit(produit: schemas.ProduitCreate, db: Session = Depends(get_db)):
    """Créer un nouveau produit"""
    db_produit = Produit(
        id=generate_id(),
        **produit.model_dump()
    )
    
    try:
        db.add(db_produit)
        db.commit()
        db.refresh(db_produit)
        return db_produit
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création: {str(e)}"
        )

@router.put("/{produit_id}", response_model=schemas.ProduitOut)
def update_produit(
    produit_id: str, 
    produit: schemas.ProduitUpdate, 
    db: Session = Depends(get_db)
):
    """Mettre à jour un produit existant"""
    db_produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not db_produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    
    update_data = produit.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_produit, field, value)
    
    try:
        db.commit()
        db.refresh(db_produit)
        return db_produit
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la mise à jour: {str(e)}"
        )

@router.delete("/{produit_id}")
def delete_produit(produit_id: str, db: Session = Depends(get_db)):
    """Supprimer un produit"""
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    
    try:
        db.delete(produit)
        db.commit()
        return {"message": "Produit supprimé avec succès"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la suppression: {str(e)}"
        )

@router.post("/{produit_id}/promo", response_model=schemas.ProduitOut)
def set_promo(
    produit_id: str,
    pourcentage: int = Query(..., gt=0, le=100),
    db: Session = Depends(get_db)
):
    """Appliquer une promotion à un produit"""
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit introuvable")
    
    produit.promotion = pourcentage
    produit.prix_original = produit.prix
    produit.prix = produit.prix * (1 - pourcentage / 100)
    
    try:
        db.commit()
        db.refresh(produit)
        return produit
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'application de la promo: {str(e)}"
        )

@router.get("/categorie/{categorie_nom}", response_model=List[schemas.ProduitOut])
def get_produits_par_categorie(
    categorie_nom: str,
    db: Session = Depends(get_db),
    nouveau: Optional[bool] = None,
    promo: Optional[bool] = None,
    limit: int = 20,
    offset: int = 0
):
    """
    Récupère les produits d'une catégorie spécifique avec options de filtrage:
    - `categorie_nom`: Nom de la catégorie (ex: 'Smartphones')
    - `nouveau`: Filtrer seulement les nouveaux produits (true/false)
    - `promo`: Filtrer seulement les produits en promo (true/false)
    - `limit`: Nombre de résultats par page (défaut: 20)
    - `offset`: Position de départ (pour pagination)
    """
    # Construction de la requête de base
    query = db.query(Produit).filter(
        Produit.categorie.ilike(f"%{categorie_nom}%")
    )
    
    # Filtres optionnels
    if nouveau is not None:
        query = query.filter(Produit.est_nouveau == nouveau)
    if promo is not None:
        query = query.filter(Produit.promotion.isnot(None) if promo else Produit.promotion.is_(None))
    
    # Exécution avec pagination
    produits = query.offset(offset).limit(limit).all()
    
    if not produits:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Aucun produit trouvé dans la catégorie '{categorie_nom}'"
        )
    
    return produits