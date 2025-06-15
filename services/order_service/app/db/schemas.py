from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class LigneCommandeBase(BaseModel):
    produit_id: str
    quantite: int
    prix_unitaire: float

class LigneCommandeCreate(LigneCommandeBase):
    pass

class LigneCommande(LigneCommandeBase):
    id: str
    commande_id: str

    class Config:
        orm_mode = True

class CommandeBase(BaseModel):
    utilisateur_id: str
    statut: Optional[str] = 'en_attente'
    total: float

class CommandeCreate(CommandeBase):
    lignes: List[LigneCommandeCreate]

class Commande(CommandeBase):
    id: str
    date_commande: datetime
    lignes: List[LigneCommande]

    class Config:
        orm_mode = True
