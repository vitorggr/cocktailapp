import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';

export const AuthMiddleware = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const isProtectedRoute = ['/receitas', '/contato'].some(path => 
        location.pathname.startsWith(path)
      );

      if (isProtectedRoute && !user) {
        navigate('/login', {
          state: { from: location.pathname },
          replace: true
        });
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  return children;
}