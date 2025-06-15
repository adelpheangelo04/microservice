from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.db.database import Base  # <- Utilise le Base du fichier database.py
import datetime
import uuid

def generate_id():
    """Génère une chaine aléatoire de 6 caractères."""
    return uuid.uuid4().hex[:6]


class Commande(Base):
    __tablename__ = 'commandes'
    id = Column(String(6), primary_key=True, default=generate_id)
    utilisateur_id = Column(String(6), nullable=False)
    date_commande = Column(DateTime, default=datetime.datetime.utcnow)
    statut = Column(String(50), default='en_attente')
    total = Column(Float, nullable=False)
    lignes = relationship('LigneCommande', back_populates='commande', cascade='all, delete-orphan')


class LigneCommande(Base):
    __tablename__ = 'ligne_commandes'
    id = Column(String(6), primary_key=True, default=generate_id)
    commande_id = Column(String(6), ForeignKey('commandes.id', ondelete='CASCADE'), nullable=False)
    produit_id = Column(String(6), nullable=False)
    quantite = Column(Integer, nullable=False)
    prix_unitaire = Column(Float, nullable=False)
    commande = relationship('Commande', back_populates='lignes')