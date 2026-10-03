import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedToken = localStorage.getItem('@VirtualBookshelf:token');
      const storedUser = localStorage.getItem('@VirtualBookshelf:user');

      if (storedToken && storedUser) {
        try {
          // Valida o token e atualiza as infos do usuário pegando do backend
          const response = await api.get('/users/me');
          setUser(response.data);
        } catch (error) {
          console.error("Token inválido ou expirado", error);
          logout();
        }
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      // O backend retorna a string pura, não um objeto JSON com propriedade token
      const token = response.data;
      
      localStorage.setItem('@VirtualBookshelf:token', token);
      
      // Busca dados do usuário após login
      const userResponse = await api.get('/users/me');
      localStorage.setItem('@VirtualBookshelf:user', JSON.stringify(userResponse.data));
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error(error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.'
      };
    }
  }

  async function register(name, nickname, email, password) {
    try {
      await api.post('/auth/register', { name, nickname, email, password });
      return await login(email, password);
    } catch (error) {
      console.error(error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao realizar cadastro.'
      };
    }
  }

  async function refreshUser() {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
      localStorage.setItem('@VirtualBookshelf:user', JSON.stringify(response.data));
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  }

  function logout() {
    localStorage.removeItem('@VirtualBookshelf:token');
    localStorage.removeItem('@VirtualBookshelf:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, register, logout, loading, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
