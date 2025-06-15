from fastapi import FastAPI, Request, HTTPException
from app.gateway.proxy import forward_request
from app.gateway.services import SERVICES

app = FastAPI(
    title="API Gateway",
    description="Point d'entrée unique pour toutes les requêtes des microservices.",
    version="1.0.0"
)

# Middleware CORS
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nouvelle route avec prefix /api
@app.api_route("/api/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway(service: str, path: str, request: Request):
    """
    Route protégée sous /api/
    """
    service_url = SERVICES.get(service.lower())
    if not service_url:
        raise HTTPException(status_code=404, detail=f"Service '{service}' introuvable.")
    
    return await forward_request(service_url, f"/{path}", request)