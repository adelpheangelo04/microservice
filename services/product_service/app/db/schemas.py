from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import uuid

class ProduitBase(BaseModel):
    nom: str
    description: str
    prix: float
    stock: int
    categorie: str
    image_url: Optional[str] = None
    est_nouveau: Optional[bool] = False
    promotion: Optional[int] = None  # Pourcentage de réduction (15 pour 15%)
    note: Optional[float] = None  # Note moyenne (0-5)
    avis: Optional[int] = 0  # Nombre d'avis

class ProduitCreate(ProduitBase):
    pass

class ProduitUpdate(BaseModel):
    nom: Optional[str] = None
    description: Optional[str] = None
    prix: Optional[float] = None
    stock: Optional[int] = None
    categorie: Optional[str] = None
    image_url: Optional[str] = None
    est_nouveau: Optional[bool] = None
    promotion: Optional[int] = None
    note: Optional[float] = None
    avis: Optional[int] = None

class ProduitOut(ProduitBase):
    id: str
    
    class Config:
        from_attributes = True  # Pour Pydantic v2 (anciennement orm_mode=True)

class ProduitDelete(BaseModel):
    id: str

class ProduitSearch(BaseModel):
    nom: Optional[str] = None
    categorie: Optional[str] = None
    en_promotion: Optional[bool] = None
    est_nouveau: Optional[bool] = None
    prix_min: Optional[float] = None
    prix_max: Optional[float] = None