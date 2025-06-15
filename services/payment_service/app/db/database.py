from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# URL de connexion SQLite (un service, une base de données)

DATABASE_URL = "sqlite:///./paiement.db"

# Création de l'moteur de base de données
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Création de la factory de sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base de toutes les modèles
Base = declarative_base()


def get_db():
    """Dépendance FastAPI afin d'obtenir une connexion DB."""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
