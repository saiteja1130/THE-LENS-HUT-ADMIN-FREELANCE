import { initialMockAdminProfile, initialMockStoreSettings } from "../data/mockStores";
const STORAGE_KEY_PROFILE = "thelenshut_admin_profile";
const STORAGE_KEY_STORE = "thelenshut_store_settings";
const settingsService = {
  getAdminProfile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const data = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!data) return initialMockAdminProfile;
    try {
      return JSON.parse(data);
    } catch {
      return initialMockAdminProfile;
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
    if (!data) return initialMockStoreSettings;
    try {
      return JSON.parse(data);
    } catch {
      return initialMockStoreSettings;
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
