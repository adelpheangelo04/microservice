from fastapi import FastAPI
from app.api.routes import router  # tes routes de paiement ici
from app.db.database import Base, engine

# Crée les tables dans la base SQLite "paiement.db"
Base.metadata.create_all(bind=engine)
print("✅ Base de données SQLite 'paiement.db' initialisée avec succès.")
print("✅ Toutes les tables ont été créées.")

app = FastAPI(title="Microservice Paiement")

# Inclure le routeur principal du service paiement
app.include_router(router)
