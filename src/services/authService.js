const STORAGE_KEY_AUTH = "thelenshut_admin_auth";
const STORAGE_KEY_REMEMBER = "thelenshut_remember_me";
const authService = {
  login: async (email, password, rememberMe) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === "admin@thelenshut.com" && password === "admin123" || normalizedEmail.includes("@") && password.length >= 6) {
      const admin = {
        id: "adm-01",
        name: "Store Administrator",
        email: normalizedEmail,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      };
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY_AUTH, JSON.stringify(admin));
      localStorage.setItem(STORAGE_KEY_REMEMBER, JSON.stringify(rememberMe));
      localStorage.setItem("thelenshut_auth_token", "mock_jwt_token_thelenshut_admin");
      return admin;
    }
    throw new Error("Invalid email or password.");
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
  }
};
export {
  authService
};
