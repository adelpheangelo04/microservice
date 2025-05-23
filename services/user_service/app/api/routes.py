from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import schemas
from app.models import user as models
from app.db.database import SessionLocal
from passlib.context import CryptContext
import uuid

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    hashed_pwd = pwd_context.hash(user.mot_de_passe)
    db_user = models.User(nom=user.nom, email=user.email, mot_de_passe=hashed_pwd)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.mot_de_passe, db_user.mot_de_passe):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    return {"message": "Connexion réussie", "user_id": str(db_user.id)}

@router.get("/me", response_model=schemas.UserOut)
def get_profile(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user

@router.put("/me", response_model=schemas.UserOut)
def update_profile(user_id: str, updates: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    if updates.nom:
        user.nom = updates.nom
    if updates.mot_de_passe:
        user.mot_de_passe = pwd_context.hash(updates.mot_de_passe)
    db.commit()
    db.refresh(user)
    return user

@router.get("/admin/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.delete("/admin/user/{id}")
def delete_user(id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).get(id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    db.delete(user)
    db.commit()
    return {"message": "Utilisateur supprimé"}