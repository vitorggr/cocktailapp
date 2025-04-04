import React from 'react';
import { useAuth } from './auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/home');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!user) return null;

  return (
    <button onClick={handleLogout} className="logout-button">
      Sair
    </button>
  );
};

export default Logout;