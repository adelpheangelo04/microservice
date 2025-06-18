from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import schemas
from app.models import user as models
from app.db.database import SessionLocal
from passlib.context import CryptContext

import logging

# Configuration du logger
logging.basicConfig(format='[ %(levelname)s ] %(message)s', level=logging.INFO)
logger = logging.getLogger()


router = APIRouter()

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Erreur de base de données")
    finally:
        db.close()


@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(models.User).filter(models.User.email == user.email).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email déjà utilisé")

        hashed_pwd = pwd_context.hash(user.mot_de_passe)
        db_user = models.User(nom=user.nom, email=user.email, mot_de_passe=hashed_pwd)

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    except Exception as e:
        logger.error(f"Error during registration: {e}")
        raise HTTPException(status_code=500, detail="Une erreur est survenue lors de l'enregistrement")

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if not db_user or not pwd_context.verify(user.mot_de_passe, db_user.mot_de_passe):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiant ou mot de passe invalides")

        return {"message": "Connexion réussie", "user_id": db_user.id}

    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Une erreur est survenue lors de la connexion")



@router.post("/login_admin")
def login_admin(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if not db_user or not pwd_context.verify(user.mot_de_passe, db_user.mot_de_passe):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiant ou mot de passe invalides")

        if(db_user.role != 'admin'):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Vous n'etes pas autoriser a vous connecter")

        return {"message": "Connexion admin réussie", "user_id": db_user.id}

    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Une erreur est survenue lors de la connexion")



@router.get("/me/{user_id}", response_model=schemas.UserOut)
def get_profile(user_id: str, db: Session = Depends(get_db)):
    try:
        user = db.get(models.User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")
        return user

    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        raise HTTPException(status_code=500, detail="Une erreur est survenue lors de la récupération du profil")

@router.put("/me/{user_id}", response_model=schemas.UserOut)
def update_profile(user_id: str, updates: schemas.UserUpdate, db: Session = Depends(get_db)):
    try:
        user = db.get(models.User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")

        if updates.nom:
            user.nom = updates.nom
        if updates.mot_de_passe:
            user.mot_de_passe = pwd_context.hash(updates.mot_de_passe)

        db.commit()
        db.refresh(user)
        return user

    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail="Une erreur est survenue lors de la mise à jour du profil")

@router.get("/admin/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    try:
        users = db.query(models.User).all()
        return users

    except Exception as e:
        logger.error(f"Error listing users: {e}")
        raise HTTPException(status_code=500, detail="Une erreur est survenue lors de la récupération des utilisateurs")

@router.delete("/admin/user/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    try:
        user = db.get(models.User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")

        db.delete(user)
        db.commit()
        return {"message": "Utilisateur supprimé"}

    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        raise HTTPException(status_code=500, detail="Une erreur est survenue lors de la suppression de l'utilisateur")
    

from sqlalchemy import text

@router.get("/db-health", tags=["Health"])
def test_db_connection(db: Session = Depends(get_db)):
    """
    Endpoint pour tester la connexion à la base de données.
    """
    try:
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Connexion à la base de données réussie"}
    except Exception as e:
        logger.error(f"Error during db health check: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Échec de la connexion à la base de données: {str(e)}"
        )
