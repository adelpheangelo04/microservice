from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

class UserCreate(BaseModel):
    nom: str
    email: EmailStr
    mot_de_passe: str

class UserLogin(BaseModel):
    email: EmailStr
    mot_de_passe: str

class UserOut(BaseModel):
    id: uuid.UUID
    nom: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True  # Pydantic v2

class UserUpdate(BaseModel):
    nom: Optional[str] = None
    mot_de_passe: Optional[str] = None
