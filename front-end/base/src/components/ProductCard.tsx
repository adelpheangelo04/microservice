import type { FC } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../hooks/useTheme';
import { getImageUrl } from '../services/api';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  darkMode?: boolean;
  isNew?: boolean;
  discount?: number | null;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  className?: string;
}

const ProductCard: FC<ProductCardProps> = ({ 
  id,
  title, 
  price, 
  originalPrice,
  image, 
  description, 
  darkMode = false,
  isNew = false,
  discount = null,
  rating = 0,
  reviewCount = 0,
  stock = 0,
  className = ''
}) => {
  const { addToCart } = useCart();
  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  const roundedRating = Math.round(rating * 2) / 2;

  const handleAddToCart = () => {
    addToCart({
      id,
      name: title,
      price: discountedPrice,
      image
    });
  };

  return (
    <div className={`group relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 
      ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border ${className}`}>
      
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {isNew && (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500 text-white">
            Nouveau
          </span>
        )}
        {discount && (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {stock <= 0 && (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-500 text-white">
            Rupture
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <img    
          src={getImageUrl(image)}
          alt={getImageUrl(image)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-black/80' : 'from-black/60'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Wishlist Button */}
        <div className="absolute top-4 right-4">
          <button className={`p-2 rounded-full backdrop-blur-sm transition-colors
            ${darkMode ? 'bg-gray-700/80 text-gray-200 hover:bg-gray-600' : 'bg-white/90 text-gray-800 hover:bg-white'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      


      {/* Product Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-xl font-bold transition-colors ${darkMode ? 'text-gray-100 group-hover:text-indigo-400' : 'text-gray-800 group-hover:text-indigo-600'}`}>
            {title}
          </h3>
          <div className="flex flex-col items-end">
            {discount && originalPrice && (
              <span className={`text-sm line-through ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {originalPrice.toFixed(2)}FCFA
              </span>
            )}
            <span className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {discountedPrice.toFixed(2)}FCFA
            </span>
          </div>
        </div>
        
        <p className={`mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          {/* Ratings */}
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star} 
                  className={`w-5 h-5 ${star <= roundedRating ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              ({reviewCount})
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2
              ${stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 
                darkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 
                'bg-indigo-600 hover:bg-indigo-700 text-white'}
              group-hover:shadow-lg group-hover:shadow-indigo-500/20`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{stock <= 0 ? 'Rupture' : 'Ajouter'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;