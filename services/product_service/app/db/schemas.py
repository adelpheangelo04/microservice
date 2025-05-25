from pydantic import BaseModel
from typing import Optional
import uuid


class ProduitOut(BaseModel):
    id: uuid.UUID
    nom: str
    description: str
    prix: float
    stock: int
    categorie: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True  # Pydantic v2

class ProduitCreate(BaseModel):
    nom: str
    description: str
    prix: float
    stock: int
    categorie: str
    image_url: Optional[str] = None

class ProduitUpdate(BaseModel):
    nom: Optional[str] = None
    description: Optional[str] = None
    prix: Optional[float] = None
    stock: Optional[int] = None
    categorie: Optional[str] = None
    image_url: Optional[str] = None

class ProduitDelete(BaseModel):
    id: uuid.UUID

    class Config:
        from_attributes = True  # Pydantic v2

class ProduitSearch(BaseModel):
    nom: Optional[str] = None
    categorie: Optional[str] = None


