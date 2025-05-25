from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import schemas 
from models.produit import Produit 
from db.database import SessionLocal

router = APIRouter(prefix="/produits", tags=["Produits"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/all", response_model=list[schemas.ProduitOut])
def get_all_produits(db: Session = Depends(get_db)):
    produits = db.query(Produit).all()
    return produits

@router.get("/{produit_id}", response_model=schemas.ProduitOut)
def get_produit(produit_id: str, db: Session = Depends(get_db)):
    produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not produit:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return produit

@router.post("/", response_model=schemas.ProduitOut)
def create_produit(produit: schemas.ProduitCreate, db: Session = Depends(get_db)):
    db_produit = Produit(nom=produit.nom,description=produit.description,prix=produit.prix,stock=produit.stock ,categorie=produit.categorie,image_url=produit.image_url)
    db.add(db_produit)
    db.commit()
    db.refresh(db_produit)
    return db_produit

@router.post("/admin", response_model=schemas.ProduitCreate)
def create_produit(produit: schemas.ProduitCreate, db: Session = Depends(get_db)):
    db_produit = Produit(nom=produit.nom,description=produit.description,prix=produit.prix,stock=produit.stock,categorie=produit.categorie,image_url=produit.image_url)
    db.add(db_produit)
    db.commit()
    db.refresh(db_produit)
    return db_produit

@router.put("/admin/{produit_id}", response_model=schemas.ProduitOut)
def update_produit(produit_id: str,produit: schemas.ProduitUpdate , db: Session = Depends(get_db)):
    db_produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not db_produit:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    else:
        if produit.nom:
            db_produit.nom = produit.nom
        if produit.description:
            db_produit.description = produit.description
        if produit.prix:
            db_produit.prix = produit.prix
        if produit.stock:
            db_produit.stock= produit.stock
        if produit.categorie:
            db_produit.categorie = produit.categorie
        if produit.image_url:
            db_produit.image_url = produit.image_url
    db.commit()
    db.refresh(db_produit)
    return db_produit

@router.delete("/admin/{produit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_produit(produit_id: str, db: Session = Depends(get_db)):
    db_produit = db.query(Produit).filter(Produit.id == produit_id).first()
    if not db_produit:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    db.delete(db_produit)
    db.commit()
    return {"detail": "Produit supprimé avec succès"}