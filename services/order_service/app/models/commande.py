from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import uuid
import datetime

Base = declarative_base()

class Commande(Base):
    __tablename__ = 'commandes'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    utilisateur_id = Column(UUID(as_uuid=True), nullable=False)
    date_commande = Column(DateTime, default=datetime.datetime.utcnow)
    statut = Column(String(50), default='en_attente')
    total = Column(Float, nullable=False)
    lignes = relationship('LigneCommande', back_populates='commande', cascade='all, delete-orphan')

class LigneCommande(Base):
    __tablename__ = 'ligne_commandes'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    commande_id = Column(UUID(as_uuid=True), ForeignKey('commandes.id', ondelete='CASCADE'), nullable=False)
    produit_id = Column(UUID(as_uuid=True), nullable=False)
    quantite = Column(Integer, nullable=False)
    prix_unitaire = Column(Float, nullable=False)
    commande = relationship('Commande', back_populates='lignes') 