from fastapi import FastAPI
from app.api.routes import router
from app.db.database import Base, engine
from app.models.produit import Produit

# Création des tables dans la base SQLite
Base.metadata.create_all(bind=engine)
print("✅ Base de données SQLite initialisée avec succès.")
print("✅ Toutes les tables ont été créées.")
print("➡ Fichier de base de données généré : product.db")

app = FastAPI(title="Produit Microservice")
app.include_router(router)
