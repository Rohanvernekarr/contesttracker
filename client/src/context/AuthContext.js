import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const userData = response.data.data;
        const userWithPicture = {
          ...userData,
          picture: userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=random`
        };
        setUser(userWithPicture);
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(userWithPicture));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Sending login request with:', { 
        email,
        passwordLength: password?.length,
        password: password
      });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { token, user } = response.data.data;
      const userWithPicture = {
        ...user,
        picture: user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithPicture));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userWithPicture);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  };

  const googleLogin = async (credential) => {
    try {
      console.log('Sending Google credential to server...');
      const response = await api.post('/auth/google', { token: credential });
      console.log('Server response:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        const userWithPicture = {
          ...user,
          picture: user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`
        };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithPicture));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userWithPicture);
        
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Google login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      googleLogin, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 