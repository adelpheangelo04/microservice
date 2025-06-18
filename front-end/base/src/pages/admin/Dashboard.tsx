import React, { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { api } from '../../services/api';
import type { ProductResponse, ProductUpdate } from '../../services/api';
import ImageUpload from '../../components/ImageUpload';
import MenuFloat from '../../components/MenuFLoat';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [formData, setFormData] = useState<Partial<ProductResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Données pour les graphiques
  const salesData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Ventes',
        data: [1, 2, 3, 5, 2, 3],
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryData = {
    labels: ['Telephones', 'Laptops', 'Audio', 'Accessoires'],
    datasets: [
      {
        label: 'Produits par catégorie',
        data: [1, 1, 1, 1],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(16, 185, 129, 0.7)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsData, usersData, ordersData] = await Promise.all([
        api.getProducts(),
        api.getAllUsers(),
        api.getAllCommandes(),
      ]);

      setProducts(productsData.data);
      setStats({
        totalProducts: productsData.data.length,
        totalUsers: usersData.data.length,
        totalOrders: ordersData.data.length,
        totalRevenue: ordersData.data.reduce((acc, order) => acc + order.total, 0),
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (product?: ProductResponse) => {
    if (product) {
      setSelectedProduct(product);
      setFormData(product);
    } else {
      setSelectedProduct(null);
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({});
  };

  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.image_url;

      if (selectedImage) {
        const uploadResponse = await api.uploadImage(selectedImage);
        imageUrl = uploadResponse.url;
      }

      const productData = {
        ...formData,
        image_url: imageUrl,
      };

      if (selectedProduct) {
        await api.updateProduct(selectedProduct.id, productData as ProductUpdate);
      } else {
        await api.createProduct(productData as ProductResponse);
      }
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await api.deleteProduct(id);
        fetchData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <MenuFloat />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Bienvenue dans votre espace d'administration</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Système opérationnel</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Dernière mise à jour: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Carte Produits */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <InventoryIcon className="text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Produits</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            <div className="mt-2 h-1 bg-gradient-to-r from-indigo-300 to-indigo-500 rounded-full"></div>
          </div>
        </div>

        {/* Carte Utilisateurs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <PeopleIcon className="text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Utilisateurs</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <div className="mt-2 h-1 bg-gradient-to-r from-green-300 to-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Carte Commandes */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                <CartIcon className="text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Commandes</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <div className="mt-2 h-1 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full"></div>
          </div>
        </div>

        {/* Carte Revenus */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <MoneyIcon className="text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Revenus</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)} FCFA</p>
            <div className="mt-2 h-1 bg-gradient-to-r from-purple-300 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique Évolution des ventes */}
        <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Évolution des ventes</h3>
          <div className="h-80">
            <Line 
              data={salesData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Graphique Produits par catégorie */}
        <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Produits par catégorie</h3>
          <div className="h-80">
            <Bar 
              data={categoryData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Liste des produits</h2>
            <button
              onClick={() => handleOpenDialog()}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow hover:shadow-md"
            >
              <AddIcon className="mr-2" />
              Ajouter un produit
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.prix} €</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.categorie}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenDialog(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dialog pour ajouter/modifier un produit */}
      {openDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {selectedProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={formData.nom || ''}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                    <input
                      type="number"
                      value={formData.prix || ''}
                      onChange={(e) => setFormData({ ...formData, prix: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      value={formData.stock || ''}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <input
                      type="text"
                      value={formData.categorie || ''}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image du produit</label>
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      currentImageUrl={formData.image_url}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.est_nouveau || false}
                      onChange={(e) => setFormData({ ...formData, est_nouveau: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Nouveau produit</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Promotion (%)</label>
                    <input
                      type="number"
                      value={formData.promotion || 0}
                      onChange={(e) => setFormData({ ...formData, promotion: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {selectedProduct ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;