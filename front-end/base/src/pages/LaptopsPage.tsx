import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { api, type ProductResponse } from '../services/api';
import MenuFloat from '../components/MenuFLoat';


const LaptopsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const [filter, setFilter] = useState('all'); // all, new, promo, instock
  const [sort, setSort] = useState('pertinence');
  
  const [laptops, setLaptops] = useState<ProductResponse[]>([]);

  useEffect(() => {
    api.getProductsByCategory('laptop').then((response) => {
      setLaptops(response.data);
    });
  }, []);

  // Filtrage :
  let processed = laptops.filter((laptop) => {
    if (filter === 'new') return laptop.est_nouveau;
    if (filter === 'promo') return laptop.promotion;
    if (filter === 'instock') return laptop.stock > 0;
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
            Nos Laptops
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Découvrez notre sélection de laptops haut de gamme aux meilleurs prix
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


<div className="container mx-auto px-4 pb-16 mt-10">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {processed.map((laptop) => (
      <div key={laptop.id} className="group perspective-1000 hover:z-10 transition-all duration-300">
        <div className="relative preserve-3d group-hover:rotate-y-10 transition-transform duration-500 m-2">
          <ProductCard 
            id={laptop.id}
            title={laptop.nom}
            price={laptop.promotion ? laptop.prix * (1 - laptop.promotion / 100) : laptop.prix}
            originalPrice={laptop.promotion ? laptop.prix : undefined}
            description={laptop.description}
            image={laptop.image_url}
            darkMode={darkMode}
            isNew={laptop.est_nouveau}
            discount={laptop.promotion}
            rating={laptop.note}
            reviewCount={laptop.avis}
            stock={laptop.stock}
            className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'} border`}
          />
        </div>
      </div>
    ))}
  </div>
</div>



    
    </div>
  );
};

export default LaptopsPage;