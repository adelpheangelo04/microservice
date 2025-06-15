from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List

import uuid
from app.models.paiement import Paiement
from app.db.schemas import PaiementCreate, PaiementOut
from app.db.database import get_db

router = APIRouter(prefix="/paiements", tags=["Paiements"])


def generate_transaction_number():
    """Génère un numéro de transaction unique (UUID hex)."""
    return uuid.uuid4().hex


# ---------------------------
# 🛒 Créer un nouveau paiement
# ---------------------------

@router.post("/", response_model=PaiementOut, status_code=status.HTTP_201_CREATED)
def create_paiement(paiement: PaiementCreate, db: Session = Depends(get_db)):
    """
    Crée un nouveau paiement après validation du moyen de paiement.
    Retourne le paiement avec son statut et un numéro de transaction généré.
    """

    # Valider le moyen de paiement
    moyens_valides = ["visa", "mastercard", "mtn", "orange"]
    if paiement.moyen_paiement not in moyens_valides:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Moyen de paiement '{paiement.moyen_paiement}' non pris en charge. Moyens valides : {', '.join(moyens_valides)}"
        )

    # Générer un numéro de transaction
    numero_transaction = generate_transaction_number()

    try:
        db_paiement = Paiement(
            commande_id=paiement.commande_id,
            utilisateur_id=paiement.utilisateur_id,
            montant=paiement.montant,
            moyen_paiement=paiement.moyen_paiement,
            numero_transaction=numero_transaction,
            statut="reussi"
        )
        db.add(db_paiement)
        db.commit()
        db.refresh(db_paiement)

        return db_paiement

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur lors de l'enregistrement du paiement : {str(e)}"
        )


# ---------------------------
# 📋 Obtenir tous les paiements
# ---------------------------

@router.get("/", response_model=List[PaiementOut])
def get_all_paiements(db: Session = Depends(get_db)):
    """
    Récupère la liste de tous les paiements enregistrés.
    """
    return db.query(Paiement).all()


# ---------------------------
# 🔍 Obtenir un paiement par ID
# ---------------------------

@router.get("/{paiement_id}", response_model=PaiementOut)
def get_paiement(paiement_id: str, db: Session = Depends(get_db)):
    """
    Récupère les détails d’un paiement spécifique via son ID.
    Si non trouvé → 404
    """
    paiement = db.query(Paiement).filter(Paiement.id == paiement_id).first()
    if not paiement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Paiement avec l'ID '{paiement_id}' introuvable."
        )
    return paiement


# ---------------------------
# 🧾 Obtenir les paiements d'un utilisateur
# ---------------------------

@router.get("/utilisateur/{utilisateur_id}", response_model=List[PaiementOut])
def get_paiements_by_usuario(utilisateur_id: str, db: Session = Depends(get_db)):
    """
    Liste tous les paiements effectués par un utilisateur donné.
    Si aucun paiement trouvé → retourne une liste vide.
    """
    paiements = db.query(Paiement).filter(Paiement.utilisateur_id == utilisateur_id).all()
    return paiements


# ---------------------------
# 📄 Obtenir les paiements liés à une commande
# ---------------------------

@router.get("/commande/{commande_id}", response_model=List[PaiementOut])
def get_paiements_by_commande(commande_id: str, db: Session = Depends(get_db)):
    """
    Liste tous les paiements associés à une commande spécifique.
    """
    paiements = db.query(Paiement).filter(Paiement.commande_id == commande_id).all()
    return paiements