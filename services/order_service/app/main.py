from fastapi import FastAPI
from app.api.routes import router as commande_router

from app.models.commande import Base
from app.db.database import engine

# Crée toutes les tables dans la base de données SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(commande_router)
