import { api } from './api';

const STORAGE_KEY_AUTH = "thelenshut_admin_auth";
const STORAGE_KEY_REMEMBER = "thelenshut_remember_me";

const authService = {
  login: async (email, password, rememberMe) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Authenticate with Backend API
      const res = await api.post('/auth/login', {
        email: normalizedEmail,
        password,
      });

      if (res.data && res.data.success) {
        const { token, user } = res.data.data;

        // Role restriction: Admin only
        if (user.role !== 'admin') {
          throw new Error("Access denied: You do not have administrator permissions.");
        }

        const admin = {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        };

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY_AUTH, JSON.stringify(admin));
        localStorage.setItem(STORAGE_KEY_REMEMBER, JSON.stringify(rememberMe));
        localStorage.setItem("thelenshut_auth_token", token);
        return admin;
      }
    } catch (apiError) {
      // If server returned specific validation/forbidden error
      if (apiError.response?.data?.message) {
        throw new Error(apiError.response.data.message);
      }
      if (apiError.message && apiError.message.includes("Access denied")) {
        throw apiError;
      }

      throw new Error(apiError.response?.data?.message || apiError.message || "Invalid email or password.");
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem("thelenshut_auth_token");
  },

  getCurrentAdmin: () => {
    const rememberMeStr = localStorage.getItem(STORAGE_KEY_REMEMBER);
    const rememberMe = rememberMeStr ? JSON.parse(rememberMeStr) : false;
    const authStr = localStorage.getItem(STORAGE_KEY_AUTH) || sessionStorage.getItem(STORAGE_KEY_AUTH);
    if (authStr) {
      try {
        const admin = JSON.parse(authStr);
        return { admin, rememberMe };
      } catch {
        return { admin: null, rememberMe: false };
      }
    }
    return { admin: null, rememberMe };
  },
};

export { authService };
