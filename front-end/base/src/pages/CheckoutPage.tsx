import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import MenuFloat from '../components/MenuFLoat';

interface OrderItem {
  produit_id: string;
  quantite: number;
  prix_unitaire: number;
}

interface Order {
  id: string;
  utilisateur_id: string;
  statut: string;
  total: number;
  lignes: OrderItem[];
}

const CheckoutPage = () => {
  const { clearCart } = useCart();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!state?.orderId) {
      navigate('/cart');
      return;
    }
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.getCommandeDetail(state.orderId);
        setOrder(response.data as Order);
      } catch (error) {
        console.error("Erreur lors du chargement de la commande :", error);
        setError("Impossible de charger les détails de la commande.");
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [state, navigate]);

  const handlePayment = async (paymentMethod: string) => {
    if (!order) return;

    setLoading(true);
    try {
      await api.updateCommandeStatut(order.id, "validee");
      clearCart();
      navigate('/order-confirmation', {
        state: { orderId: order.id, paymentMethod, orderTotal: order.total }
      });
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      setError("Une erreur est survenue lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <MenuFloat />
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
        <p className="dark:text-gray-200 font-semibold">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <MenuFloat />
        <div className="bg-red-100 dark:bg-red-900 p-6 rounded-md shadow-md">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/cart')}
            className="px-4 py-2 bg-red-600 dark:bg-red-500 text-gray-100 font-semibold rounded-md hover:bg-red-500 dark:hover:bg-red-400 transition"
          >
            Retour au panier
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <MenuFloat />
        <div className="p-6 rounded-md shadow-md">
          <p className="dark:text-gray-200 mb-4">
            Commande introuvable.
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-gray-100 font-semibold rounded-md hover:bg-indigo-500 dark:hover:bg-indigo-400 transition"
          >
            Retour au panier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <MenuFloat />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Finalisation de la commande #{order.id.slice(0, 8)}...
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section Paiement */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6 dark:text-gray-200">
                Méthode de paiement
              </h2>

              <div className="space-y-4">
                {[
                   { label: "Mobile Money", icon: "📱", value: "mobile_money", description: "MTN, Orange, Moov" },
                   { label: "Carte de crédit", icon: "💳", value: "credit_card", description: "Visa, Mastercard" },
                   { label: "Espèces (à la livraison)", icon: "💰", value: "cash", description: "Payez en espèces" }
                 ].map((item) => (
                   <button
                     key={item.value}
                     onClick={() => handlePayment(item.value)}
                     disabled={loading}
                     className="w-full p-4 border dark:border-gray-700 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                   >
                     <div className="flex items-center">
                       <span className="text-2xl mr-3">{item.icon}</span>
                       <div>
                         <p className="font-semibold dark:text-gray-200">{item.label}</p>
                         <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                       </div>
                     </div>
                     <span>➡️</span>
                   </button>
                 ))}
               </div>
            </div>

            {/* Récapitulatif */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-6 dark:text-gray-200">
                Récapitulatif
              </h2>

              <div className="space-y-4">
                {order.lignes?.map((item) => (
                   <div key={item.produit_id} className="flex justify-between items-center">
                     <div className="flex items-center">
                       <div className="w-10 h-10 mr-3 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md">
                         <span>📦</span>
                       </div>
                       <span className="dark:text-gray-200">
                         {item.quantite} x {item.produit_id.slice(0,6)}...
                       </span>
                     </div>
                     <span className="font-semibold dark:text-gray-200">
                       {(item.prix_unitaire * item.quantite).toLocaleString()} FCFA
                     </span>
                   </div>
                 ))}

                <div className="border-t dark:border-gray-700 pt-4 mt-4 flex justify-between">
                   <span className="text-lg font-semibold dark:text-gray-200">
                     Total :
                   </span>
                   <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                     {order.total.toLocaleString()} FCFA
                   </span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CheckoutPage;
