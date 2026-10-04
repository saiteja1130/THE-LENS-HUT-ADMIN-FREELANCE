import { useSettings } from "../../hooks/useSettings";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { AdminProfileForm } from "../../components/settings/AdminProfileForm";
import { StoreSettingsForm } from "../../components/settings/StoreSettingsForm";
import { Loader } from "../../components/common/Loader";
const Settings = () => {
  const {
    adminProfile,
    storeSettings,
    loading,
    updateAdminProfile,
    updateStoreSettings
  } = useSettings();
  if (loading) {
    return <Loader message="Loading settings..." fullPage />;
  }
  return <PageContainer className="max-w-4xl">
      <PageHeader
    title="Settings"
    description="Admin credentials, store contact information, and shipping thresholds"
  />

      <div className="space-y-8">
        <AdminProfileForm
    initialData={adminProfile}
    onSave={updateAdminProfile}
  />

        <StoreSettingsForm
    initialData={storeSettings}
    onSave={updateStoreSettings}
  />
      </div>
    </PageContainer>;
};
var stdin_default = Settings;
export {
  Settings,
  stdin_default as default
};
