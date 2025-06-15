import uuid
from sqlalchemy import Column, String, Float
from app.db.database import Base

class Paiement(Base):
    __tablename__ = "paiements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()) )
    commande_id = Column(String, nullable=False)  # La commande associée
    utilisateur_id = Column(String, nullable=False)  # L'utilisateur ayant effectué le paiement
    montant = Column(Float, nullable=False)
    moyen_paiement = Column(String, nullable=False)  # "visa", "mastercard", "mtn", "orange"
    numero_transaction = Column(String, unique=True, nullable=False)
    statut = Column(String, nullable=False, default="reussi")
