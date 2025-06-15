# tests/test_order_service.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db.schemas import CommandeCreate, LigneCommandeCreate
from app.models.commande import Commande


def test_create_commande(client: TestClient, db_session: Session):
    # Données de test
    commande_data = {
        "utilisateur_id": "user_123",
        "statut": "en_attente",
        "total": 200.0,
        "lignes": [
            {
                "produit_id": "prod_456",
                "quantite": 2,
                "prix_unitaire": 100.0
            }
        ]
    }

    response = client.post("/commande", json=commande_data)
    assert response.status_code == 201

    data = response.json()
    assert "id" in data
    assert data["utilisateur_id"] == "user_123"
    assert len(data["lignes"]) == 1


def test_get_commande_by_id(client: TestClient, db_session: Session):
    # Créer une commande d'abord
    commande = Commande(
        utilisateur_id="b8f66f",
        statut="en_attente",
        total=150.0
    )
    db_session.add(commande)
    db_session.commit()
    db_session.refresh(commande)

    # Appel GET
    response = client.get(f"/commande/{commande.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == commande.id
    assert data["statut"] == "en_attente"


def test_get_commandes_by_user(client: TestClient, db_session: Session):
    # Ajouter deux commandes pour le même utilisateur
    for i in range(2):
        commande = Commande(
            utilisateur_id="b8f66f",
            statut="expediée",
            total=100.0
        )
        db_session.add(commande)
    db_session.commit()

    # Appel GET
    response = client.get("/commande/utilisateur/user_test")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_update_statut_commande(client: TestClient, db_session: Session):
    # Créer une commande
    commande = Commande(
        utilisateur_id="b8f66f",
        statut="en_attente",
        total=150.0
    )
    db_session.add(commande)
    db_session.commit()
    db_session.refresh(commande)

    # Mettre à jour le statut
    new_statut = "expediée"
    response = client.put(f"/commande/{commande.id}/statut", json={"statut": new_statut})
    assert response.status_code == 200
    data = response.json()
    assert data["statut"] == new_statut