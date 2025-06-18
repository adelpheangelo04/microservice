// src/services/api.ts

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Fonction pour obtenir l'URL complète d'une image
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/api/products/${imagePath}`;
};

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

// Interface pour les paiements
export interface PaiementData {
  id?: string;
  commande_id: string;
  utilisateur_id: string;
  montant: number;
  moyen_paiement: string;
  numero_transaction?: string;
  statut?: string;
}

// Interface pour les mises à jour de produit
export interface ProductUpdate {
  nom?: string;
  description?: string;
  prix?: number;
  stock?: number;
  categorie?: string;
  image_url?: string;
  est_nouveau?: boolean;
  promotion?: number;
}

// Interface pour l'upload d'image
export interface ImageUploadResponse {
  url: string;
  filename: string;
}

// Service
export const api = {
  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>('/users/register', data),

  login: (data: LoginData) =>
    apiClient.post<AuthResponse>('/users/login', data),

  login_admin: (data: LoginData) =>
    apiClient.post<AuthResponse>('/users/login_admin', data),

  // 🔥 Services Produits
  getProducts: () => {
    return apiClient.get<ProductResponse[]>('/products/produits');
  },

  getProductById: (id: string) => {
    return apiClient.get<ProductResponse>(`/products/produits/${id}`);
  },

  getCategories: () => {
    return apiClient.get<string[]>('/products/produits/categories/liste');
  },

  getProductsByCategory: (categorie: string) => {
    return apiClient.get<ProductResponse[]>(`/products/produits/categorie/${categorie}`);
  },

  createProduct: (data: ProductResponse) => {
    return apiClient.post<ProductResponse>('/products/produits', data);
  },

  updateProduct: (id: string, data: ProductUpdate) => {
    return apiClient.put<ProductResponse>(`/products/produits/${id}`, data);
  },

  deleteProduct: (id: string) => {
    return apiClient.delete(`/products/produits/${id}`);
  },

  setProductPromo: (id: string, pourcentage: number) => {
    return apiClient.post<ProductResponse>(`/products/produits/${id}/promo?pourcentage=${pourcentage}`);
  },

  // 🛒 Services Commandes
  createCommande: (data: CommandeData) => {
    return apiClient.post<CommandeData>('/orders/commande', data);
  },

  getCommandeDetail: (id: string) => {
    return apiClient.get<CommandeData>(`/orders/commande/get/${id}`);
  },

  getCommandesByUtilisateur: (utilisateur_id: string) => {
    return apiClient.get<CommandeData[]>(`/orders/commande/utilisateur/${utilisateur_id}`);
  },

  getAllCommandes: () => {
    return apiClient.get<CommandeData[]>('/orders/commande/admin');
  },

  updateCommandeStatut: (id: string, statut: string) => {
    return apiClient.put<CommandeData>(`/orders/commande/${id}/statut?statut=${statut}`);
  },

  // 💳 Services Paiements
  createPaiement: (data: PaiementData) => {
    return apiClient.post<PaiementData>('/payments/paiements', data);
  },

  getPaiement: (id: string) => {
    return apiClient.get<PaiementData>(`/payments/paiements/${id}`);
  },

  getAllPaiements: () => {
    return apiClient.get<PaiementData[]>('/payments/paiements');
  },

  getPaiementsByUtilisateur: (utilisateur_id: string) => {
    return apiClient.get<PaiementData[]>(`/payments/paiements/utilisateur/${utilisateur_id}`);
  },

  getPaiementsByCommande: (commande_id: string) => {
    return apiClient.get<PaiementData[]>(`/payments/paiements/commande/${commande_id}`);
  },

  // 👤 Services Utilisateurs
  getProfile: (user_id: string) => {
    return apiClient.get<AuthResponse>(`/users/me/${user_id}`);
  },

  updateProfile: (user_id: string, data: { nom?: string; mot_de_passe?: string }) => {
    return apiClient.put<AuthResponse>(`/users/me/${user_id}`, data);
  },

  getAllUsers: () => {
    return apiClient.get<AuthResponse[]>('/users/admin/users');
  },

  deleteUser: (user_id: string) => {
    return apiClient.delete(`/users/admin/user/${user_id}`);
  },

  checkDbHealth: () => {
    return apiClient.get('/users/db-health');
  },

  // Services d'upload d'images
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<ImageUploadResponse>('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};