import { defaultAdminProfile, defaultStoreSettings } from "../data/defaultSettings";
import { authService } from "./authService";

const STORAGE_KEY_PROFILE = "thelenshut_admin_profile";
const STORAGE_KEY_STORE = "thelenshut_store_settings";

const getFallbackProfile = () => {
  const current = authService.getCurrentAdmin()?.admin;
  if (current) {
    return {
      name: current.name || "",
      email: current.email || "",
    };
  }
  return defaultAdminProfile;
};

const settingsService = {
  getAdminProfile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const data = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!data) return getFallbackProfile();
    try {
      return JSON.parse(data);
    } catch {
      return getFallbackProfile();
    }
  },
  updateAdminProfile: async (profile) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    return profile;
  },
  getStoreSettings: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const data = localStorage.getItem(STORAGE_KEY_STORE);
    if (!data) return defaultStoreSettings;
    try {
      return JSON.parse(data);
    } catch {
      return defaultStoreSettings;
    }
  },
  updateStoreSettings: async (settings) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    localStorage.setItem(STORAGE_KEY_STORE, JSON.stringify(settings));
    return settings;
  }
};
export {
  settingsService
};
