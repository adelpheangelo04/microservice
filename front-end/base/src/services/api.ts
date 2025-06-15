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

// Service
export const api = {
  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>('/users/register', data),

  login: (data: LoginData) =>
    apiClient.post<AuthResponse>('/users/login', data)
};