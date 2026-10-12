import { useState } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useBanners } from "../../hooks/useBanners";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { BannerTable } from "../../components/banners/BannerTable";
import { BannerForm } from "../../components/banners/BannerForm";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";
const BannerList = () => {
  const { banners, loading, addBanner, updateBanner, deleteBanner, toggleBanner } = useBanners();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleOpenAdd = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, data);
        toast.success("Banner saved");
      } else {
        await addBanner({ ...data, order: banners.length + 1 });
        toast.success("Banner saved");
      }
      handleCloseModal();
    } catch {
      toast.error("Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBanner(bannerToDelete);
      toast.success("Banner deleted successfully");
      setBannerToDelete(null);
    } catch {
      toast.error("Failed to delete banner");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleToggle = async (id) => {
    try {
      await toggleBanner(id);
      toast.success("Banner status updated");
    } catch {
      toast.error("Failed to toggle banner");
    }
  };
  return <PageContainer>
      <PageHeader
    title="Banners"
    description="Homepage hero carousels, seasonal discount banners, and call-to-action slides"
    actions={<Button
      variant="secondary"
      onClick={handleOpenAdd}
      icon={<Plus className="w-4 h-4" />}
    >
            Add Banner
          </Button>}
  />

      {!loading && banners.length === 0 ? <EmptyState
    title="No banners found"
    description="There are no marketing banners configured for the storefront."
    icon={<ImageIcon className="w-8 h-8 text-slate-400" />}
    actionLabel="Add Banner"
    onAction={handleOpenAdd}
  /> : <BannerTable
    banners={banners}
    onEdit={handleOpenEdit}
    onDelete={(id) => setBannerToDelete(id)}
    onToggleActive={handleToggle}
    isLoading={loading}
  />}

      {
    /* Add / Edit Banner Modal */
  }
      <Modal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    title={editingBanner ? `Edit Banner: ${editingBanner.title}` : "Add New Promotional Banner"}
    description="Configure banner imagery, headlines, and destination links"
    maxWidth="lg"
  >
        <BannerForm
    initialData={editingBanner}
    onSubmit={handleSubmit}
    onCancel={handleCloseModal}
    isLoading={isSubmitting}
  />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(bannerToDelete)}
        onClose={() => setBannerToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this promotional banner? It will immediately stop appearing on the storefront."
        confirmLabel="Delete Banner"
        isLoading={isDeleting}
        variant="danger"
      />
    </PageContainer>;
};
var stdin_default = BannerList;
export {
  BannerList,
  stdin_default as default
};
