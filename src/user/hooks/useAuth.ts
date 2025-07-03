import { useState, useEffect } from 'react';
import { checkAndValidateToken, logout as logoutUser } from '../user/services/userService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const isValid = await checkAndValidateToken();
      setIsAuthenticated(isValid);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    logout
  };
}; 