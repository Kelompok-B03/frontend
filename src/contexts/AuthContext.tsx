"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/navigation';
import RegisterRequest from '@/types/requests/RegisterRequest';
import User from '@/types/User';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginData: { email: string, password: string }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  register: (registerData: RegisterRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setUser(null);
      setToken(null);
      axiosInstance.defaults.headers.common['Authorization'] = '';
      setIsLoading(false);
      return;
    }

    // Ensure token is set for subsequent requests in this session if rehydrating
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
    setIsLoading(true);

    try {
      const meResponse = await axiosInstance.get('/auth/me');
      const { email: authenticatedUserEmail } = meResponse.data;

      if (!authenticatedUserEmail) {
        console.error('/auth/me did not return an email.');
        throw new Error('Authentication failed: User email not found.');
      }

      const profileResponse = await axiosInstance.get(`/api/users/email/${authenticatedUserEmail}`);
      const detailedUserData: User = profileResponse.data;

      setUser(detailedUserData);
      setToken(currentToken);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      axiosInstance.defaults.headers.common['Authorization'] = '';
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (loginData: { email: string, password: string }) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', loginData);
      const { token: newAuthToken } = response.data;
      console.log('Full API Response:', response);         // See the whole response object
      console.log('API Response Data (response.data):', response.data); // THIS IS CRITICAL

      if (newAuthToken) {
        localStorage.setItem('token', newAuthToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAuthToken}`;
        setToken(newAuthToken);
        await fetchUser();
      } else {
        throw new Error('Token not found in login response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      axiosInstance.defaults.headers.common['Authorization'] = '';
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_logged_in');
    setUser(null);
    setToken(null);
    axiosInstance.defaults.headers.common['Authorization'] = '';
  };

  const register = async (registerData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', registerData);
      router.push('/auth/login');
      console.log('Registration successful via AuthContext (simulated)', response.data);
    } catch (error) {
      console.error('Registration failed via AuthContext:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        register,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};