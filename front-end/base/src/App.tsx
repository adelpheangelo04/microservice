import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import { AuthProvider, useAuth } from './context/AuthContext';
import TelephonesPage from './pages/TelephonesPage';
import LaptopsPage from './pages/LaptopsPage.tsx';
import AudioPage from './pages/AudioPage.tsx';
import { CartProvider } from './context/CartContext'; // Importez le CartProvider
import CartPage from './pages/CartPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import OrderConfirmation from './pages/OrderConfirmation.tsx';
import UserOrders from './pages/UserOrders.tsx';
import AdminLogin from './pages/admin/Login.tsx';
import Dashboard from './pages/admin/Dashboard.tsx';
import AccessoiresPage from './pages/AccessoiresPage.tsx';


function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/telephones" element={<TelephonesPage />} />
      <Route path="/laptops" element={<LaptopsPage/>} />
      <Route path="/audio" element={<AudioPage/>} />
      <Route path="/accessoires" element={<AccessoiresPage/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/checkout" element={<CheckoutPage/>} />
      <Route path="/order-confirmation" element={<OrderConfirmation/>} />
      <Route path="/user-orders" element={<UserOrders/>} />
      <Route path="/admin/login" element={<AdminLogin/>} />
      <Route path="/admin/dashboard" element={<Dashboard/>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* Ajoutez le CartProvider ici */}
        <Router>
          <div className="min-h-screen w-full">
            <AppContent />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}