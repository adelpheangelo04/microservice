import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import MenuFloat from '../components/MenuFLoat';
import { api } from '../services/api';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();


    console.log('handleCheckout invoqué'); // 1
  
    if (!user?.user_id) {
      console.log('pas d’utilisateur, redirection login'); // 2
      navigate('/login');
      return;
    }

    console.log('Données de la commande :', cart); // 3
    
    const commandeData = {
      utilisateur_id: user.user_id,
      statut: "en_attente",
      total: cartTotal,
      payment_method: "pending",
      lignes: cart.map(item => ({
        produit_id: String(item.id),
        quantite: item.quantity,
        prix_unitaire: item.price
      }))
    };
    
    try {
      const response = await api.createCommande(commandeData);
      console.log('Réponse de createCommande :', response);
    
      // vérifie le format de la donnée retournée
      const orderId = response?.data?.id;
  
      if (orderId) {
        console.log('Redirection vers checkout'); // 5
        navigate('/checkout', { state: { orderId, orderTotal: cartTotal } });
      } else {
        console.error('Aucun ID de commande retourné par le serveur');
      }
    
    } catch (error) {
      console.error('Erreur lors de la création de la commande :', error);
      // toast.error("Impossible de lancer le paiement.");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 p-6">
      <MenuFloat />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            🛒 {/* Emoji panier */}/chec
            <span className="ml-3">Votre Panier</span>
          </h1>
          {cart.length > 0 && (
            <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
              {cart.reduce((total, item) => total + item.quantity, 0)} articles
            </span>
          )}
        </div>
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-8xl mb-6">🛒</div> {/* Gros emoji panier vide */}
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">Votre panier est vide</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
              Explorez nos produits et trouvez des articles qui vous plaisent !
            </p>
            <Link
              to="/"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 flex items-center"
            >
              🛍️ {/* Emoji shopping */}
              <span className="ml-2">Commencer mes achats</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6 flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 mb-4 sm:mb-0">
                      <div className="w-32 h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-4xl">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="object-contain h-full" />
                        ) : (
                          '📱' /* Emoji produit par défaut */
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 sm:ml-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors text-2xl"
                          aria-label="Supprimer"
                        >
                          ❌ {/* Emoji suppression */}
                        </button>
                      </div>
                      
                      <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg my-2">
                        {item.price.toLocaleString()} FCFA
                      </p>
                      
                      <div className="flex items-center mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
                        >
                          ➖
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300 dark:border-gray-600 text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
                        >
                          ➕
                        </button>
                        
                        <div className="ml-auto text-right">
                          <p className="text-gray-600 dark:text-gray-300">Total</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md sticky top-4">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                    📋 {/* Emoji checklist */}
                    <span className="ml-2">Récapitulatif</span>
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300 flex items-center">
                        🧾 {/* Emoji facture */}
                        <span className="ml-2">Articles</span>
                      </span>
                      <span className="font-medium dark:text-white">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300 flex items-center">
                        💰 {/* Emoji argent */}
                        <span className="ml-2">Sous-total</span>
                      </span>
                      <span className="font-medium dark:text-white">
                        {cartTotal.toLocaleString()} FCFA
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300 flex items-center">
                        🚚 {/* Emoji camion */}
                        <span className="ml-2">Livraison</span>
                      </span>
                      <div className="flex items-center text-green-500">
                        <span className="font-medium">Gratuite</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold dark:text-white">
                        <span className="flex items-center">
                          💳 {/* Emoji carte */}
                          <span className="ml-2">Total</span>
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {cartTotal.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                      <button
                        onClick={clearCart}
                        className="w-full flex items-center justify-center py-2 px-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        🗑️ {/* Emoji poubelle */}
                        <span className="ml-2">Vider le panier</span>
                      </button>
                      
                      <button
                      onClick={handleCheckout}
                      className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-center rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 flex items-center justify-center"
                    >
                      ✨ {/* Emoji étincelles */}
                      <span className="ml-2">Passer la commande</span>
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;