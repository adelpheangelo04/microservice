from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus


Base= declarative_base() 
# Encode correctement le mot de passe s'il contient des caractères spéciaux
password = quote_plus("microservicepwd")
user = "microservice"
host = "51.254.165.121"
port = "5432"
db_name = "microservice_db"

DATABASE_URL = f"postgresql://{user}:{password}@{host}:{port}/{db_name}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

"""# URL de connexion à la base de données
DATABASE_URL = "sqlite:///./produit.db"  # ou postgres, mysql selon ton cas

# Création du moteur SQLAlchemy
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False },echo=True  # option sqlite seulement
)

# Création de la session locale
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Crée la base et les tables si elles n'existent pas encore

# Fonction pour récupérer une session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
"""
