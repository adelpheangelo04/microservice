from fastapi import FastAPI
from app.api import routes
from app.db.database import engine, Base
# Créer les tables dans la base de données
Base.metadata.create_all(bind=engine)
# # Initialiser l'application FastAPI et inclure les routes
# from app.db import schemas, models  # Importer les modèles pour créer les tables
# from app.db.database import SessionLocal  # Importer la session de base de données
# from app.models import user as models  # Importer les modèles utilisateur
# from app.db import schemas  # Importer les schémas pour la validation des données

app = FastAPI()
app.include_router(routes.router)
