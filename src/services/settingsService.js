import { defaultAdminProfile, defaultStoreSettings } from "../data/defaultSettings";
import { authService } from "./authService";
import { api } from "./api";

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
    const data = localStorage.getItem(STORAGE_KEY_STORE);
    let localSettings = defaultStoreSettings;
    try {
      if (data) localSettings = { ...defaultStoreSettings, ...JSON.parse(data) };
    } catch {
      localSettings = defaultStoreSettings;
    }
    try {
      const response = await api.get("/settings/shipping");
      if (response.data?.success && response.data.data) {
        return { ...localSettings, ...response.data.data };
      }
    } catch {
      // Keep local store details available if the API is temporarily unreachable.
    }
    return localSettings;
  },
  updateStoreSettings: async (settings) => {
    const response = await api.put("/settings/shipping", {
      freeShippingMinimum: Number(settings.freeShippingMinimum),
      standardShippingFee: Number(settings.standardShippingFee),
    });
    if (!response.data?.success) {
      throw new Error(response.data?.message || "Could not save shipping settings");
    }
    const updatedSettings = { ...settings, ...response.data.data };
    localStorage.setItem(STORAGE_KEY_STORE, JSON.stringify(updatedSettings));
    return updatedSettings;
  }
};
export {
  settingsService
};
