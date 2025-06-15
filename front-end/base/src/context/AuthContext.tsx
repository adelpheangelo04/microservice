import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export const AuthContext = createContext<{
  user: any;
  setUser: (u: any) => void;
} | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  // Initialisation à partir du localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser)); 
  }, []);

  // Mettre à jours le localStorage dès que le user change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); 
    } else {
      localStorage.removeItem('user'); 
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

