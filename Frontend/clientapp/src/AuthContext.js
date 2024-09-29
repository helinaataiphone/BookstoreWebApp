import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);  // Add state for userId

  const checkAuthentication = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/status/', {
        withCredentials: true // Ensure session cookies are sent
      });
      if (response.data.isAuthenticated) {
        console.log("Auth response:", response.data);  // Log response for debugging
        setIsAuthenticated(response.data.isAuthenticated);
        setIsAdmin(response.data.isAdmin);
        setUsername(response.data.username);
        setUserId(response.data.userId);  // Update userId based on API response
      } else {
        // Reset everything if not authenticated
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUsername('');
        setUserId(null);
      }
    } catch (error) {
      console.error('Error fetching user status', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUsername('');
      setUserId(null);
    }
  };

  useEffect(() => {
    // Automatically check authentication status when the app loads
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, userId, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};
