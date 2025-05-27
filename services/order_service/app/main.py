from fastapi import FastAPI
from app.api.routes import router as commande_router

app = FastAPI()

app.include_router(commande_router)
