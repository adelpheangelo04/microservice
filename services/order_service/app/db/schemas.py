from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class LigneCommandeBase(BaseModel):
    produit_id: UUID
    quantite: int
    prix_unitaire: float

class LigneCommandeCreate(LigneCommandeBase):
    pass

class LigneCommande(LigneCommandeBase):
    id: UUID
    commande_id: UUID

    class Config:
        orm_mode = True

class CommandeBase(BaseModel):
    utilisateur_id: UUID
    statut: Optional[str] = 'en_attente'
    total: float

class CommandeCreate(CommandeBase):
    lignes: List[LigneCommandeCreate]

class Commande(CommandeBase):
    id: UUID
    date_commande: datetime
    lignes: List[LigneCommande]

    class Config:
        orm_mode = True 