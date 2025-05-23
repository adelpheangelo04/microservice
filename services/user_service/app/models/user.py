from sqlalchemy import Column, String, Text, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "utilisateurs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    mot_de_passe = Column(Text, nullable=False)
    role = Column(String(20), default="client")
    date_creation = Column(DateTime, default=datetime.utcnow)