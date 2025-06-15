import subprocess
import multiprocessing
import os
import sys
from pathlib import Path

def run_service(service_name, port):
    """Lance un service FastAPI avec uvicorn sur un port spécifique"""
    service_path = Path(__file__).parent / service_name
    os.chdir(service_path)
    
    # Commande pour lancer le service avec uvicorn
    cmd = [
        "uvicorn",
        "app.main:app",
        "--host", "0.0.0.0",
        "--port", str(port),
        "--reload"
    ]
    
    try:
        print(f"Démarrage de {service_name} sur le port {port}...")
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors du lancement de {service_name}: {e}")
    except Exception as e:
        print(f"Erreur inattendue pour {service_name}: {e}")

def main():
    # Configuration des services et leurs ports
    services = {
        "user_service": 8001,
        "product_service": 8002,
        "order_service": 8003,
        "payment_service": 8004
    }
    
    # Création des processus pour chaque service
    processes = []
    for service, port in services.items():
        p = multiprocessing.Process(target=run_service, args=(service, port))
        p.start()
        processes.append(p)
    
    # Attente de la fin de tous les processus
    try:
        for p in processes:
            p.join()
    except KeyboardInterrupt:
        print("\nArrêt de tous les services...")
        for p in processes:
            p.terminate()
        for p in processes:
            p.join()

if __name__ == "__main__":
    main() 