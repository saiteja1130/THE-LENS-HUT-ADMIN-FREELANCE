import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    try {
      const current = authService.getCurrentAdmin();
      setAdmin(current.admin);
      setRememberMe(current.rememberMe);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);
  const login = async (email, password, remember) => {
    setLoading(true);
    try {
      const loggedAdmin = await authService.login(email, password, remember);
      setAdmin(loggedAdmin);
      setRememberMe(remember);
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    authService.logout();
    setAdmin(null);
  };
  return <AuthContext.Provider
    value={{
      admin,
      isAuthenticated: !!admin,
      loading,
      rememberMe,
      login,
      logout
    }}
  >
      {children}
    </AuthContext.Provider>;
};
export {
  AuthContext,
  AuthProvider
};
