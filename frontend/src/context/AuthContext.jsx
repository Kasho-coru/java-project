import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

// Demonstration accounts fallback (used before Spring Boot backend is connected or for testing)
export const DEMO_ACCOUNTS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@organization.com',
    fullName: 'Alexandra Vance',
    role: 'ADMIN',
    employeeId: null,
    designation: 'System Administrator',
    department: 'Executive Administration'
  },
  {
    id: 2,
    username: 'manager',
    email: 'm.brody@organization.com',
    fullName: 'Marcus Brody',
    role: 'MANAGER',
    employeeId: 101,
    designation: 'Engineering Director',
    department: 'Engineering'
  },
  {
    id: 3,
    username: 'sarah',
    email: 's.jenkins@organization.com',
    fullName: 'Sarah Jenkins',
    role: 'EMPLOYEE',
    employeeId: 102,
    designation: 'Senior Lead Engineer',
    department: 'Engineering'
  },
  {
    id: 4,
    username: 'david',
    email: 'd.kim@organization.com',
    fullName: 'David Kim',
    role: 'EMPLOYEE',
    employeeId: 103,
    designation: 'Software Engineer',
    department: 'Engineering'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('th_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('th_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('th_user');
    }
  }, [currentUser]);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Try real backend Spring Boot API
      const response = await api.post('/auth/login', {
        username: usernameOrEmail,
        password: password
      });

      if (response.data && response.data.data) {
        const user = response.data.data;
        setCurrentUser(user);
        setLoading(false);
        navigate('/dashboard');
        return user;
      }
    } catch (apiErr) {
      // 2. If backend is not yet started or returned 401, check demo accounts for testing
      const trimmed = usernameOrEmail.trim().toLowerCase();
      const matched = DEMO_ACCOUNTS.find(
        (acc) =>
          (acc.username.toLowerCase() === trimmed || acc.email.toLowerCase() === trimmed) &&
          (password === `${acc.username}123` || password === 'admin123')
      );

      if (matched) {
        setCurrentUser(matched);
        setLoading(false);
        navigate('/dashboard');
        return matched;
      }

      const msg = apiErr.response?.data?.message || 'Invalid username or password. Please verify credentials.';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('th_user');
    navigate('/login');
  };

  const hasRole = (roles) => {
    if (!currentUser) return false;
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    return currentUser.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        loading,
        error,
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
