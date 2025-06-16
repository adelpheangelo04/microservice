// components/MenuFloat.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../context/CartContext';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

const MenuFloat = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const { cartItemCount } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems: MenuItem[] = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/laptops', label: 'Laptops', icon: '💻' },
    { path: '/telephones', label: 'Smartphones', icon: '📱' },
    { path: '/tablets', label: 'Tablettes', icon: '⌨️' },
    { path: '/accessoires', label: 'Accessoires', icon: '🎧' },
    { path: '/contact', label: 'Contact', icon: '✉️' },
    { path: '/cart', label: 'Panier', icon: '🛒' },
    { path: '/user-orders', label: 'Mes commandes', icon: '🛒' },
  ];

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {cartItemCount > 0 && (
        <div
          className={`absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold
            ${theme === 'dark' ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}
        >
          {cartItemCount}
        </div>
      )}

      <button
        onClick={toggleMenu}
        className={`w-16 h-16 rounded-full shadow-lg transition-all flex items-center justify-center text-white
          ${theme === 'dark' ? 'bg-indigo-800 hover:bg-indigo-900' : 'bg-indigo-600 hover:bg-indigo-700'}
          ${isOpen ? 'rotate-90' : ''} transform transition-transform duration-200
          ring-2 ${theme === 'dark' ? 'ring-indigo-500' : 'ring-indigo-300'}
        `}
        aria-label="Menu flottant"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`absolute bottom-20 right-0 w-64 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm
              ${theme === 'dark' ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-gray-200'}`}
          >
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-5 py-3 transition-colors
                    ${theme === 'dark' 
                      ? 'text-gray-200 hover:bg-indigo-900/50' 
                      : 'text-gray-800 hover:bg-indigo-50'}
                  `}
                  onClick={toggleMenu}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              <button
                onClick={toggleTheme}
                className={`w-full flex items-center px-5 py-3 transition-colors
                  ${theme === 'dark' 
                    ? 'text-gray-200 hover:bg-indigo-900/50' 
                    : 'text-gray-800 hover:bg-indigo-50'}
                `}
              >
                <span className="mr-3 text-lg">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
                <span>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuFloat;