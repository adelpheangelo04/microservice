// src/services/api.ts

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Types
export interface RegisterData {
  nom: string;
  email: string;
  mot_de_passe: string;
}

export interface LoginData {
  email: string;
  mot_de_passe: string;
}

export interface AuthResponse {
  id: string;
  nom: string;
  email: string;
}

// Interface produit
export interface ProductResponse {
  id: string;
  nom: string;
  description: string;
  prix: number;
  stock: number;
  categorie: string;
  image_url: string;
  est_nouveau: boolean;
  promotion: number;
  note: number;
  avis: number;
}




export interface CommandeData {
  id?: string;
  utilisateur_id: string;
  statut: string;
  total: number;
  lignes: {
    produit_id: string;
    quantite: number;
    prix_unitaire: number;
  }[];
}

/*

exemple de requete curl pour changer le statut d'une commande
  curl -X 'GET' \
  'http://127.0.0.1:8000/api/orders/commande/utilisateur/b8f66f' \
  -H 'accept: application/json'


*/


// Service
export const api = {
  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>('/users/register', data),

  login: (data: LoginData) =>
    apiClient.post<AuthResponse>('/users/login', data),

  // 🔥 Ajout du service produits
  getProducts: () => {
    return apiClient.get<ProductResponse[]>('/products/produits');
  },

  getPoductByCategorie: (categorie: string) => {
    return apiClient.get<ProductResponse[]>(`/products/produits/categorie/${categorie}`);
    
  },

  createCommande: (data: CommandeData) => {
    return apiClient.post<CommandeData>('/orders/commande', data);
    },

  getCommandesByUtilisateur: (utilisateur_id: string) => {
    return apiClient.get<CommandeData[]>(`/orders/commande/utilisateur/${utilisateur_id}`);
  },

  updateCommandeStatut: (commande_id: string, statut: string) => {
    return apiClient.put<CommandeData>(`/orders/commande/${commande_id}/statut?statut=${statut}`);
  },

  getCommandeDetail: (commande_id: string) => {
    return apiClient.get<CommandeData>(`/orders/commande/get/${commande_id}`);
  }
};