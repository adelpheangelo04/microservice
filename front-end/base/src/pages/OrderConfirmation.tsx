// pages/OrderConfirmation.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuFloat from '../components/MenuFLoat';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <MenuFloat />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Commande confirmée !
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Merci pour votre achat. Votre commande #{orderId} a bien été enregistrée.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Nous avons envoyé les détails de votre commande à votre adresse email.
              Vous recevrez une notification lorsque votre commande sera expédiée.
            </p>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-8">
              <h2 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                Suivi de commande
              </h2>
              <p className="text-indigo-600 dark:text-indigo-300">
                Vous pouvez suivre l'état de votre commande dans votre espace client.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Retour à l'accueil
              </button>
              <button
                onClick={() => navigate('/user-orders')}
                className="border border-indigo-600 text-indigo-600 dark:text-indigo-300 dark:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Voir mes commandes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;