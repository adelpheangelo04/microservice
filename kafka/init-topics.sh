#!/bin/bash

# Attendre que Kafka soit prêt
echo "Attente de Kafka..."
sleep 30

# Créer les topics pour chaque service
kafka-topics --create --if-not-exists \
    --bootstrap-server kafka:29092 \
    --topic orders \
    --partitions 3 \
    --replication-factor 1

kafka-topics --create --if-not-exists \
    --bootstrap-server kafka:29092 \
    --topic products \
    --partitions 3 \
    --replication-factor 1

kafka-topics --create --if-not-exists \
    --bootstrap-server kafka:29092 \
    --topic users \
    --partitions 3 \
    --replication-factor 1

kafka-topics --create --if-not-exists \
    --bootstrap-server kafka:29092 \
    --topic payments \
    --partitions 3 \
    --replication-factor 1

echo "Topics créés avec succès!" 