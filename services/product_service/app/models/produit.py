from sqlalchemy import Column, String, Integer, Float, Boolean
from sqlalchemy.orm import declarative_base
import uuid
from app.db.database import Base

class Produit(Base):
    __tablename__ = "produits"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nom = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    prix = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False)
    
    # Pour les badges (nouveau/promo)
    est_nouveau = Column(Boolean, default=False)
    promotion = Column(Integer)  # Null si pas en promo, sinon % (ex: 15)
    
    # Pour la catégorie (simplifié)
    categorie = Column(String(50))  # Ex: "Smartphones"
    
    # Une seule image pour rester simple
    image_url = Column(String)
    
    # Pour les étoiles de notation
    note = Column(Float)  # Ex: 4.5
    avis = Column(Integer)  # Nombre d'avis (ex: 128)

    def __repr__(self):
        return f"<Produit {self.nom} - {self.prix}FCFA>"