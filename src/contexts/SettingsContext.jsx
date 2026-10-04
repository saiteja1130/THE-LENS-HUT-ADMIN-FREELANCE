import { createContext, useState, useEffect, useCallback } from "react";
import { settingsService } from "../services/settingsService";
import { initialMockAdminProfile, initialMockStoreSettings } from "../data/mockStores";
const SettingsContext = createContext(void 0);
const SettingsProvider = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState(initialMockAdminProfile);
  const [storeSettings, setStoreSettings] = useState(initialMockStoreSettings);
  const [loading, setLoading] = useState(true);
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, store] = await Promise.all([
        settingsService.getAdminProfile(),
        settingsService.getStoreSettings()
      ]);
      setAdminProfile(profile);
      setStoreSettings(store);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  const updateAdminProfile = async (profile) => {
    const updated = await settingsService.updateAdminProfile(profile);
    setAdminProfile(updated);
    return updated;
  };
  const updateStoreSettings = async (settings) => {
    const updated = await settingsService.updateStoreSettings(settings);
    setStoreSettings(updated);
    return updated;
  };
  return <SettingsContext.Provider
    value={{
      adminProfile,
      storeSettings,
      loading,
      updateAdminProfile,
      updateStoreSettings
    }}
  >
      {children}
    </SettingsContext.Provider>;
};
export {
  SettingsContext,
  SettingsProvider
};
