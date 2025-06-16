import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import MenuFloat from '../components/MenuFLoat';

const AccessoiresPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [filter, setFilter] = useState('all'); // all, new, promo, instock
  const [sort, setSort] = useState('pertinence');
  
  // Données de test pour les téléphones
  const telephones = [
    {
      id: 'tel_001',
      nom: 'Smartphone Premium X',
      description: 'Écran 6.7" AMOLED 120Hz, triple caméra 108MP, batterie 5000mAh',
      prix: 899.99,
      promotion: 15,
      image_url: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00',
      est_nouveau: true,
      note: 4.7,
      avis: 215,
      stock: 42,
      caracteristiques: [
        "Écran 6.7\" AMOLED",
        "Processeur Snapdragon 8 Gen 2",
        "128Go de stockage",
        "Triple caméra 108MP"
      ]
    },
    {
      id: 'tel_002',
      nom: 'Phone Max Pro',
      description: 'Performances extrêmes avec écran 120Hz et charge ultra-rapide',
      prix: 749.99,
      promotion: null,
      image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb',
      est_nouveau: false,
      note: 4.5,
      avis: 189,
      stock: 25,
      caracteristiques: [
        "Écran 6.5\" 120Hz",
        "Charge 65W",
        "Double caméra 50MP",
        "Batterie 4500mAh"
      ]
    },
    {
      id: 'tel_003',
      nom: 'Compact Z3',
      description: 'Design compact avec toutes les fonctionnalités premium',
      prix: 659.99,
      promotion: 20,
      image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd',
      est_nouveau: true,
      note: 4.3,
      avis: 97,
      stock: 0, // Rupture de stock
      caracteristiques: [
        "Écran 5.9\" Full HD",
        "Processeur haut de gamme",
        "Appareil photo nocturne",
        "IP68 étanche"
      ]
    },
    {
      id: 'tel_004',
      nom: 'Gamer Edition',
      description: 'Optimisé pour le gaming avec refroidissement actif',
      prix: 799.99,
      promotion: 10,
      image_url: 'https://images.unsplash.com/photo-1605170439002-90845e8c0137',
      est_nouveau: false,
      note: 4.8,
      avis: 312,
      stock: 18,
      caracteristiques: [
        "Écran 144Hz",
        "Refroidissement liquide",
        "Batterie 6000mAh",
        "4 haut-parleurs"
      ]
    },
  ];

  // Filtrage :
  let processed = telephones.filter((phone) => {
    if (filter === 'new') return phone.est_nouveau;
    if (filter === 'promo') return phone.promotion;
    if (filter === 'instock') return phone.stock > 0;
    return true;
  });

  // Tri :
  processed = processed.sort((a, b) => {
    if (sort === 'price_asc') {
      return (a.promotion ? a.prix * (1 - a.promotion / 100) : a.prix) - (b.promotion ? b.prix * (1 - b.promotion / 100) : b.prix);
    }
    if (sort === 'price_desc') {
      return (b.promotion ? b.prix * (1 - b.promotion / 100) : b.prix) - (a.promotion ? a.prix * (1 - a.promotion / 100) : a.prix);
    }
    if (sort === 'best') {
      return Number(b.note) - Number(a.note);
    }
    if (sort === 'new') {
      return Number(b.est_nouveau) - Number(a.est_nouveau);
    }
    return 0;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <MenuFloat />
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-600 to-purple-600'} text-white py-20`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nos Smartphones
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Découvrez notre sélection de téléphones haut de gamme aux meilleurs prix
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="container mx-auto px-4 py-8">
  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} border shadow-md mb-8`}>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="font-semibold mb-2">Filtrer par :</h3>
        <div className="flex flex-wrap gap-3">
                    <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm ${
                filter === 'all'
                ? (darkMode ? 'bg-gray-600 font-semibold' : 'bg-gray-300 font-semibold')
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
            }`}
            >
            Tous
            </button>
            <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-full text-sm ${
                filter === 'new'
                ? (darkMode ? 'bg-gray-600 font-semibold' : 'bg-gray-300 font-semibold')
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
            }`}
            >
            Nouveautés
            </button>
            <button
            onClick={() => setFilter('promo')}
            className={`px-4 py-2 rounded-full text-sm ${
                filter === 'promo'
                ? (darkMode ? 'bg-gray-600 font-semibold' : 'bg-gray-300 font-semibold')
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
            }`}
            >
            En promo
            </button>
            <button
            onClick={() => setFilter('instock')}
            className={`px-4 py-2 rounded-full text-sm ${
                filter === 'instock'
                ? (darkMode ? 'bg-gray-600 font-semibold' : 'bg-gray-300 font-semibold')
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
            }`}
            >
            En stock
            </button>

        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Trier par :</h3>
        <select
        onChange={(e) => setSort(e.target.value)}
        value={sort}
        className={`px-4 py-2 rounded-full text-sm ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border`}
        >
        <option value="pertinence">Pertinence</option>
        <option value="price_asc">Prix (croissant)</option>
        <option value="price_desc">Prix (décroissant)</option>
        <option value="new">Nouveautés</option>
        <option value="best">Meilleures notes</option>
        </select>

      </div>
    </div>
  </div>
</div>


<div className="container mx-auto px-4 pb-16">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {processed.map((telephone) => (
      <div key={telephone.id} className="group perspective-1000 hover:z-10 transition-all duration-300">
        <div className="relative preserve-3d group-hover:rotate-y-10 transition-transform duration-500">
          <ProductCard 
            id={telephone.id}
            title={telephone.nom}
            price={telephone.promotion ? telephone.prix * (1 - telephone.promotion / 100) : telephone.prix}
            originalPrice={telephone.promotion ? telephone.prix : undefined}
            description={telephone.description}
            image={telephone.image_url}
            darkMode={darkMode}
            isNew={telephone.est_nouveau}
            discount={telephone.promotion}
            rating={telephone.note}
            reviewCount={telephone.avis}
            stock={telephone.stock}
            className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'} border`}
          />
        </div>
      </div>
    ))}
  </div>
</div>



      {/* Newsletter */}
      <div className={`py-16 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className={`max-w-3xl mx-auto rounded-2xl p-8 text-center ${darkMode ? 'bg-gray-800/50 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'} border shadow-lg`}>
            <h2 className="text-2xl font-bold mb-4">Ne manquez pas nos nouveautés</h2>
            <p className="mb-6 max-w-xl mx-auto">
              Abonnez-vous à notre newsletter pour recevoir nos dernières offres sur les smartphones
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className={`flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
              />
              <button className={`px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors`}>
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoiresPage;