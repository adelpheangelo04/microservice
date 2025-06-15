import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type LoginData } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    mot_de_passe: ''
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.login(formData);
      localStorage.setItem('user', JSON.stringify(res.data));

      // Mettre à jours le contexte d'authentification
      setUser(res.data);

      // Rediriger aussitôt que le login est réussi
      navigate('/');
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Se connecter
        </h2>

        {error && (
          <div className="p-2 text-center text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="email"
            type="email"
            placeholder="Adresse email"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="mot_de_passe"
            type="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 font-semibold text-gray-50 bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition ease-in-out duration-200"
          >
            Connexion
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <a
            href="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  )
}

