from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import SessionLocal
from app.models.commande import Commande, LigneCommande
from app.db.schemas import CommandeCreate, Commande as CommandeSchema

router = APIRouter(prefix="/commande", tags=["Commandes"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------
# 🔒 Authentification optionnelle (à remplacer par JWT si besoin)
# ---------------------------

def verify_admin_rights(db: Session, user_id: str):
    # À implémenter selon ton système d'authentification
    # Exemple simplifié :
    if not user_id == "admin_user_id":  # Remplacer par une vraie vérification
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé : droits administrateur requis"
        )


# ---------------------------
# 🛒 Création d'une commande
# ---------------------------

@router.post('/', response_model=CommandeSchema, status_code=status.HTTP_201_CREATED)
def create_commande(commande: CommandeCreate, db: Session = Depends(get_db)):
    """
    Crée une nouvelle commande avec ses lignes.
    Retourne la commande créée avec ID généré.
    """

    try:
        db_commande = Commande(
            utilisateur_id=commande.utilisateur_id,
            statut=commande.statut or "en_attente",
            total=commande.total
        )
        db.add(db_commande)
        db.flush()

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

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la création de la commande : {str(e)}"
        )


# ---------------------------
# 🔍 Obtenir une commande par ID
# ---------------------------

@router.get('/get/{id}', response_model=CommandeSchema)
def get_commande(id: str, db: Session = Depends(get_db)):
    """
    Récupère les détails d'une commande spécifique.
    Si non trouvée → 404
    """
    commande = db.query(Commande).filter(Commande.id == id).first()
    if not commande:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Commande avec l'id '{id}' introuvable."
        )
    return commande


# ---------------------------
# 📄 Obtenir toutes les commandes d'un utilisateur
# ---------------------------

@router.get('/utilisateur/{id}', response_model=List[CommandeSchema])
def get_commandes_by_user(id: str, db: Session = Depends(get_db)):
    """
    Liste toutes les commandes d'un utilisateur donné.
    Si aucune commande trouvée → retourne une liste vide.
    """
    commandes = db.query(Commande).filter(Commande.utilisateur_id == id).all()
    return commandes


# ---------------------------
# 📋 [ADMIN] Obtenir toutes les commandes
# ---------------------------

@router.get('/admin', response_model=List[CommandeSchema])
def get_all_commandes(db: Session = Depends(get_db)):
    """
    [Admin] Liste toutes les commandes du système.
    """
    return db.query(Commande).all()


# ---------------------------
# 🧾 [ADMIN] Mettre à jour le statut d'une commande
# ---------------------------

@router.put('/{id}/statut', response_model=CommandeSchema)
def update_commande_statut(id: str, statut: str, db: Session = Depends(get_db)):
    """
    [Admin] Met à jour le statut d'une commande existante.
    """
    commande = db.query(Commande).filter(Commande.id == id).first()
    if not commande:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Commande avec l'id '{id}' introuvable."
        )

    commande.statut = statut
    db.commit()
    db.refresh(commande)
    return commande