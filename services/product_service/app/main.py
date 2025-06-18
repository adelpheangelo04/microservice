from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as products_router
from app.api.upload import router as upload_router
from app.db.database import Base, engine
import os

# Création des tables
Base.metadata.create_all(bind=engine)
print("✅ Base de données SQLite initialisée avec succès.")
print("✅ Toutes les tables ont été créées.")
print("➡ Fichier de base de données généré : product.db")

app = FastAPI(title="Product Service")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Créer le dossier uploads s'il n'existe pas
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Monter le dossier des fichiers statiques
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Inclure les routes
app.include_router(products_router)
app.include_router(upload_router, tags=["upload"])
