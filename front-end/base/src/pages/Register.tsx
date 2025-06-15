import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type RegisterData } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState<RegisterData>({
    nom: '',
    email: '',
    mot_de_passe: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.register(formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      alert("Inscription réussie !");
      navigate('/');
    } catch (err) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input name="nom" type="text" placeholder="Nom" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          <input name="mot_de_passe" type="password" placeholder="Mot de passe" onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            S'inscrire
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Déjà un compte ? <a href="/login" className="text-indigo-600 hover:underline">Connectez-vous</a>
        </p>
      </div>
    </div>
  );
}