from fastapi import FastAPI
from  api import routes
from db import database
from models import produit


produit.Base.metadata.create_all(bind=database.engine)
print("✅ Tables créées avec succès.")

app = FastAPI(title="Produit microsercice")
app.include_router(routes.router)