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
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPayment(method);
    setError("");
  };

  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const simulatePaymentProcessing = async () => {
    // Simulation d'un délai aléatoire entre 1.5 et 3 secondes
    const delay = Math.floor(Math.random() * 1500) + 1500;
    return new Promise(resolve => setTimeout(resolve, delay));
  };

  const handlePaymentSubmit = async () => {
    if (!order || !selectedPayment) return;

    // Validation des champs
    if (selectedPayment === 'mobile_money' && !paymentDetails.phone) {
      setError("Veuillez entrer votre numéro de téléphone");
      return;
    }

    if (selectedPayment === 'credit_card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        setError("Veuillez remplir tous les champs de la carte");
        return;
      }
      if (paymentDetails.cardNumber.replace(/\s/g, '').length !== 16) {
        setError("Le numéro de carte doit contenir 16 chiffres");
        return;
      }
    }

    setError("");
    setIsProcessingPayment(true);

    try {
      // Simulation du traitement de paiement
      await simulatePaymentProcessing();
      
      // Mise à jour du statut de la commande
      await api.updateCommandeStatut(order.id, "payee");
      
      // Vider le panier
      clearCart();
      
      // Redirection vers la page de confirmation
      navigate('/order-confirmation', {
        state: { 
          orderId: order.id, 
          paymentMethod: selectedPayment, 
          orderTotal: order.total 
        }
      });
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      setError("Une erreur est survenue lors du traitement du paiement.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const renderPaymentFields = () => {
    switch (selectedPayment) {
      case 'mobile_money':
        return (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">
              Détails Mobile Money
            </h3>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={paymentDetails.phone}
                onChange={handlePaymentDetailsChange}
                placeholder="Ex: 771234567"
                className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200"
                disabled={isProcessingPayment}
              />
            </div>
            <button
              onClick={handlePaymentSubmit}
              disabled={isProcessingPayment}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex justify-center items-center"
            >
              {isProcessingPayment ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement en cours...
                </>
              ) : (
                "Confirmer le paiement"
              )}
            </button>
          </div>
        );
      
      case 'credit_card':
        return (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold dark:text-gray-200">
              Détails de la carte
            </h3>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                Numéro de carte
              </label>
              <input
                type="text"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentDetailsChange}
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200"
                disabled={isProcessingPayment}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  Date d'expiration
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handlePaymentDetailsChange}
                  placeholder="MM/AA"
                  className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200"
                  disabled={isProcessingPayment}
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentDetailsChange}
                  placeholder="123"
                  className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200"
                  disabled={isProcessingPayment}
                />
              </div>
            </div>
            <button
              onClick={handlePaymentSubmit}
              disabled={isProcessingPayment}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex justify-center items-center"
            >
              {isProcessingPayment ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement en cours...
                </>
              ) : (
                "Payer maintenant"
              )}
            </button>
          </div>
        );
      
      case 'cash':
        return (
          <div className="mt-6">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg mb-4">
              <p className="text-yellow-800 dark:text-yellow-200">
                Vous paierez en espèces lors de la livraison.
              </p>
            </div>
            <button
              onClick={handlePaymentSubmit}
              disabled={isProcessingPayment}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex justify-center items-center"
            >
              {isProcessingPayment ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Confirmation en cours...
                </>
              ) : (
                "Confirmer la commande"
              )}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <MenuFloat />
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
        <p className="dark:text-gray-200 font-semibold">Chargement de la commande...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <MenuFloat />
        <div className="bg-red-100 dark:bg-red-900 p-6 rounded-md shadow-md max-w-md w-full">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/cart')}
            className="px-4 py-2 bg-red-600 dark:bg-red-500 text-gray-100 font-semibold rounded-md hover:bg-red-500 dark:hover:bg-red-400 transition w-full"
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
        <div className="p-6 rounded-md shadow-md max-w-md w-full text-center">
          <p className="dark:text-gray-200 mb-4">
            Commande introuvable.
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-gray-100 font-semibold rounded-md hover:bg-indigo-500 dark:hover:bg-indigo-400 transition w-full"
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
                     onClick={() => handlePaymentMethodSelect(item.value)}
                     disabled={isProcessingPayment}
                     className={`w-full p-4 border dark:border-gray-700 rounded-lg flex items-center justify-between transition ${
                       selectedPayment === item.value 
                         ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'
                         : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                     } ${isProcessingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
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

               {/* Champs de paiement dynamiques */}
               {selectedPayment && renderPaymentFields()}

               {error && (
                 <div className="mt-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg">
                   {error}
                 </div>
               )}
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