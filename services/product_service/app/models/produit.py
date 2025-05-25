from sqlalchemy import Column, String, Integer, Float
from sqlalchemy.orm import  declarative_base
import uuid

Base = declarative_base()
class Produit(Base):
    __tablename__ = "produits"
    
    id = Column(String, primary_key=True,default=lambda: str(uuid.uuid4()))
    nom = Column(String, nullable=False)
    description = Column(String, nullable=False)
    prix = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False)
    categorie = Column(String, nullable=False)  # Nom de la catégorie
    image_url = Column(String, nullable=True)
    
    # Relation avec la table des catégories
    
    def __repr__(self):
        return f"<Produit(nom={self.nom}, prix={self.prix})>"