import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
from typing import Optional
import aiofiles
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "app/static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def get_file_extension(filename: str) -> str:
    return filename.rsplit(".", 1)[1].lower() if "." in filename else ""

def is_allowed_file(filename: str) -> bool:
    return get_file_extension(filename) in ALLOWED_EXTENSIONS

async def save_upload_file(upload_file: UploadFile) -> str:
    if not is_allowed_file(upload_file.filename):
        raise HTTPException(status_code=400, detail="Type de fichier non autorisé")

    # Créer un nom de fichier unique
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_filename = f"{timestamp}_{uuid.uuid4()}.{get_file_extension(upload_file.filename)}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Sauvegarder le fichier
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await upload_file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Fichier trop volumineux")
        await out_file.write(content)

    # Optimiser l'image
    try:
        with Image.open(file_path) as img:
            # Redimensionner si l'image est trop grande
            if img.width > 1200 or img.height > 1200:
                img.thumbnail((1200, 1200))
                img.save(file_path, optimize=True, quality=85)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail="Erreur lors du traitement de l'image")

    # Retourner le chemin d'accès pour le frontend via l'API Gateway
    return f"/api/products/static/uploads/{unique_filename}"


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_url = await save_upload_file(file)
        return JSONResponse(
            content={
                "url": file_url,
                "filename": os.path.basename(file_url)
            }
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))