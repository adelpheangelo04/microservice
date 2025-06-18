from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from app.gateway.proxy import forward_request
from app.gateway.services import SERVICES
import httpx

app = FastAPI(
    title="API Gateway",
    description="Point d'entrée unique pour toutes les requêtes des microservices.",
    version="1.0.0"
)

# Middleware CORS
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
    
    # Gestion spéciale pour les fichiers statiques
    if "static/uploads" in path:
        # Extraire le nom du fichier du chemin
        filename = path.split("static/uploads/")[-1]
        static_path = f"static/uploads/{filename}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{service_url}/{static_path}")
                if response.status_code == 200:
                    return Response(
                        content=response.content,
                        media_type=response.headers.get("content-type", "application/octet-stream")
                    )
                else:
                    raise HTTPException(status_code=response.status_code, detail="Fichier non trouvé")
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    
    return await forward_request(service_url, f"/{path}", request)