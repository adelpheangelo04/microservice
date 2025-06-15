from sqlalchemy import Column, String, Text, DateTime
import uuid
from datetime import datetime
from app.db.database import Base

def generate_id():
    """Génère une chaine aléatoire de 6 caractères."""
    return uuid.uuid4().hex[:6]

class User(Base):
    __tablename__ = "utilisateurs"

    id = Column(String(6), primary_key=True, default=generate_id)
    nom = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    mot_de_passe = Column(Text, nullable=False)
    role = Column(String(20), default="client")
    date_creation = Column(DateTime, default=datetime.utcnow)
