import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';
import {api, type ProductResponse} from '../services/api';
import MenuFloat from '../components/MenuFLoat';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [error, setError] = useState<string | null>(null);


  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() =>{
    const storedUser = localStorage.getItem('user');
    if(storedUser){
      setUser(JSON.parse(storedUser));
    }
  },[]);    

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.getProducts();
        setProducts(res.data);
        setError(null);
      } catch (err: any) {
        setError("Erreur lors du chargement des produits.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  

  // // Données de démonstration
  // const products = [
  //   {
  //     id: 1,
  //     title: "Smartphone XYZ",
  //     price: 699.99,
  //     image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
  //     description: "Le dernier smartphone avec des fonctionnalités innovantes et un design élégant.",
  //     isNew: true,
  //     discount: 15,
  //   },
  //   {
  //     id: 2,
  //     title: "Laptop Pro",
  //     price: 1299.99,
  //     image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
  //     description: "Un ordinateur portable puissant pour les professionnels et les créatifs.",
  //     isNew: false,
  //     discount: null,
  //   },
  //   {
  //     id: 3,
  //     title: "Casque Audio Premium",
  //     price: 199.99,
  //     image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  //     description: "Une expérience audio immersive avec notre casque haut de gamme.",
  //     isNew: true,
  //     discount: 10,
  //   },
  //   {
  //     id: 4,
  //     title: "Montre Connectée",
  //     price: 249.99,
  //     image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  //     description: "Suivez votre activité physique et restez connecté avec cette montre intelligente.",
  //     isNew: false,
  //     discount: 20,
  //   }
  // ];

  const categories = [
    { name: 'Smartphones', icon: '📱', link: '/telephones' },
    { name: 'Ordinateurs', icon: '💻',link: '/laptops' },
    { name: 'Audio', icon: '🎧',link: '/audio' },
    { name: 'Accessoires', icon: '⌚',link: '/accessoires' }
  ];

  const handleLogout = () => {
    // Supprimer l'utilisateur du localStorage
    localStorage.removeItem('user');
    // Rediriger vers la page de connexion
    navigate('/login');
  };


  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="loader animate-spin rounded-full border-t-4 border-b-4 border-indigo-500 h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <MenuFloat />
      {/* Floating Theme Toggle */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed right-6 top-6 z-50 p-3 rounded-full backdrop-blur-lg ${darkMode ? 'bg-indigo-900/30 hover:bg-indigo-900/50' : 'bg-indigo-100/70 hover:bg-indigo-200'} shadow-lg transition-all hover:scale-110`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <button 
          onClick={handleLogout}
          className={`fixed left-6 top-6 z-50 p-3 rounded-full backdrop-blur-lg ${
            darkMode 
              ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200' 
              : 'bg-red-100/70 hover:bg-red-200 text-red-500 hover:text-red-600'
          } shadow-lg transition-all hover:scale-110 flex items-center`}
          aria-label="Déconnexion"
          title="Déconnexion"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

      {/* Hero Section with Parallax Effect */}
      <div className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-600 to-purple-600'} text-white py-32`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="grid grid-cols-12 grid-rows-6 h-full">
              {[...Array(72)].map((_, i) => (
                <div key={i} className="border border-white/10"></div>
              ))}
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeIn">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Nouvelle Collection Tech
              </span>
            </h1>
            <p className="text-xl mb-10 opacity-90 animate-fadeIn delay-100">
              Innovation et design pour votre quotidien numérique
            </p>
            <button className="relative overflow-hidden group bg-white/10 backdrop-blur-md px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-white/20 animate-fadeIn delay-200">
              <span className="relative z-10">Explorer la boutique</span>
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></span>
            </button>
          </div>
        </div>
        
        {/* Floating tech elements */}
        <div className="absolute top-1/4 left-10 w-16 h-16 rounded-full bg-cyan-400/20 blur-xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-purple-400/20 blur-xl animate-float delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-full bg-indigo-400/20 blur-xl animate-float delay-2000"></div>
      </div>

      {/* Featured Products Section */}
      <section className="py-20 relative">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-600/10 to-transparent -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              Nouveautés
            </span>
            <h2 className="text-4xl font-bold mb-4">Produits Phares</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group perspective-1000 hover:z-10 transition-all duration-300"
              >
                <div className="relative preserve-3d group-hover:rotate-y-10 transition-transform duration-500">
                  <ProductCard 
                    id={product.id}
                    title={product.nom}
                    price={product.promotion ? product.prix * (1 - product.promotion / 100) : product.prix}
                    originalPrice={product.promotion ? product.prix : undefined}
                    description={product.description}
                    image={product.image_url}
                    darkMode={darkMode}
                    isNew={product.est_nouveau}
                    discount={product.promotion}
                    rating={product.note}
                    reviewCount={product.avis}
                    stock={product.stock}
                    className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'} border`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section with Hover Effects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nos Univers</h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Découvrez nos différentes gammes de produits high-tech
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`relative overflow-hidden rounded-2xl p-8 text-center transition-all duration-500 group cursor-pointer ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-lg hover:shadow-xl`}
                onClick={() => navigate(category.link)}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-6 transition-transform group-hover:scale-110 duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-70 mb-4">Découvrir les produits</p>
                  <div className="w-0 h-0.5 bg-indigo-500 mx-auto transition-all duration-500 group-hover:w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner with Glitch Effect */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 glitch-text" data-text="SOLDES D'ÉTÉ">
                SOLDES D'ÉTÉ
              </h2>
            </div>
            <p className="text-xl mb-8 opacity-90">
              Jusqu'à <span className="font-bold text-yellow-300">50%</span> de réduction sur une sélection de produits
            </p>
            <button className="relative overflow-hidden group bg-black/20 backdrop-blur-md px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-white/20">
              <span className="relative z-10">Voir les offres</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-0"></span>
            </button>
          </div>
        </div>
      </section>





    </div>
  );
};

export default Home;