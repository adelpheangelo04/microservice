from pydantic import BaseModel
from typing import Optional

class PaiementBase(BaseModel):
    commande_id: str
    utilisateur_id: str
    montant: float
    moyen_paiement: str

class PaiementCreate(PaiementBase):
    """Données utilisées lors de la création d'un paiement."""
    pass

class PaiementOut(PaiementBase):
    """Données retournées en cas de lecture d'un paiement."""
    id: str
    numero_transaction: str
    statut: str

    class Config:
        orm_mode = True
