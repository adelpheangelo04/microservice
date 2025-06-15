import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen w-full">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  )
}

