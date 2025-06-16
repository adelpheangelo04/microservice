// src/pages/UserOrders.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import MenuFloat from '../components/MenuFLoat';
import { useAuth } from '../context/AuthContext';

interface Commande {
  id: string;
  utilisateur_id: string;
  statut: string;
  total: number;
  created_at: string; // Ajoutez cette ligne si votre API retourne une date
  lignes: {
    produit_id: string;
    quantite: number;
    prix_unitaire: number;
    produit_nom?: string; // Optionnel - vous pouvez enrichir les données
  }[];
}

const UserOrders = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { user } = useAuth();
    // Récupérer l'ID utilisateur (à adapter selon votre système d'authentification)
  const utilisateur_id = user?.user_id; // Remplacez par l'ID réel de l'utilisateur connecté
  

  useEffect(() => { 
    const fetchCommandes = async () => {
      try {
        setLoading(true);
        const response = await api.getCommandesByUtilisateur(utilisateur_id);
        setCommandes(response.data as unknown as Commande[]);
      } catch (err) {
        console.error('Erreur lors du chargement des commandes:', err);
        setError('Impossible de charger les commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, [utilisateur_id]);

  const getStatusColor = (statut: string) => {
    switch (statut.toLowerCase()) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_traitement':
        return 'bg-blue-100 text-blue-800';
      case 'expediee':
        return 'bg-purple-100 text-purple-800';
      case 'livree':
        return 'bg-green-100 text-green-800';
      case 'annulee':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 p-6">
      <MenuFloat />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Mes Commandes
            </h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Retour à l'accueil
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          ) : commandes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
                Aucune commande trouvée
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Vous n'avez pas encore passé de commande.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Découvrir nos produits
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Produits
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {commandes.map((commande) => (
                      <tr key={commande.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{commande.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {commande.created_at ? formatDate(commande.created_at) : '--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(commande.statut)}`}>
                            {commande.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {commande.lignes.length} article(s)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                          {commande.total.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/commande/${commande.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                          >
                            Détails
                          </button>
                          {commande.statut === 'en_attente' && (
                            <button
                              onClick={async () => {
                                if (window.confirm('Annuler cette commande ?')) {
                                  try {
                                    await api.updateCommandeStatut(commande.id, 'annulée');
                                    setCommandes(commandes.map(cmd => 
                                      cmd.id === commande.id ? { ...cmd, statut: 'annulée' } : cmd
                                    ));
                                  } catch (err) {
                                    console.error('Erreur lors de l\'annulation:', err);
                                  }
                                }
                              }}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Annuler
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;