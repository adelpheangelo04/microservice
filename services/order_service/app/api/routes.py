from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from app.db.database import SessionLocal
from app.models.commande import Commande, LigneCommande
from app.db.schemas import CommandeCreate, Commande, LigneCommande as LigneCommandeSchema

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/commande', response_model=Commande)
def create_commande(commande: CommandeCreate, db: Session = Depends(get_db)):
    db_commande = Commande(
        utilisateur_id=commande.utilisateur_id,
        statut=commande.statut,
        total=commande.total
    )
    db.add(db_commande)
    db.flush()  # Pour obtenir l'id de la commande
    lignes = []
    for ligne in commande.lignes:
        db_ligne = LigneCommande(
            commande_id=db_commande.id,
            produit_id=ligne.produit_id,
            quantite=ligne.quantite,
            prix_unitaire=ligne.prix_unitaire
        )
        db.add(db_ligne)
        lignes.append(db_ligne)
    db.commit()
    db.refresh(db_commande)
    db_commande.lignes = lignes
    return db_commande

@router.get('/commande/{id}', response_model=Commande)
def get_commande(id: UUID, db: Session = Depends(get_db)):
    commande = db.query(Commande).filter(Commande.id == id).first()
    if not commande:
        raise HTTPException(status_code=404, detail='Commande non trouvée')
    return commande

@router.get('/commande/utilisateur/{id}', response_model=List[Commande])
def get_commandes_by_user(id: UUID, db: Session = Depends(get_db)):
    commandes = db.query(Commande).filter(Commande.utilisateur_id == id).all()
    return commandes

@router.get('/admin/commandes', response_model=List[Commande])
def get_all_commandes(db: Session = Depends(get_db)):
    return db.query(Commande).all()

@router.put('/admin/commande/{id}/statu', response_model=Commande)
def update_commande_statut(id: UUID, statut: str, db: Session = Depends(get_db)):
    commande = db.query(Commande).filter(Commande.id == id).first()
    if not commande:
        raise HTTPException(status_code=404, detail='Commande non trouvée')
    commande.statut = statut
    db.commit()
    db.refresh(commande)
    return commande 