import { useState, useMemo } from "react";
import { Plus, Image as ImageIcon, CheckCircle2, EyeOff } from "lucide-react";
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

  // Live banner metrics
  const stats = useMemo(() => {
    const total = banners.length;
    const active = banners.filter((b) => b.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [banners]);

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
        toast.success(`Banner "${data.title}" updated successfully`);
      } else {
        await addBanner({ ...data, order: banners.length + 1 });
        toast.success(`Banner "${data.title}" created successfully`);
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
      await deleteBanner(bannerToDelete.id);
      toast.success(`Banner "${bannerToDelete.title}" deleted successfully`);
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
      toast.success("Banner visibility updated");
    } catch {
      toast.error("Failed to update banner visibility");
    }
  };

  return (
    <PageContainer>
      {/* Page Header and Quick Metric Chips */}
      <div className="space-y-4">
        <PageHeader
          title="Banners"
          description="Homepage hero carousels, seasonal discount banners, and call-to-action slides"
          actions={
            <Button
              variant="secondary"
              onClick={handleOpenAdd}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Banner
            </Button>
          }
        />

        {/* Quick Stats bar */}
        {!loading && banners.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Banners
                </span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Live on Storefront
                </span>
                <p className="text-xl font-bold text-emerald-600 mt-0.5">{stats.active}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Hidden / Drafts
                </span>
                <p className="text-xl font-bold text-slate-600 mt-0.5">{stats.inactive}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <EyeOff className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Table/Cards or Empty State */}
      {!loading && banners.length === 0 ? (
        <EmptyState
          title="No banners created yet"
          description="Create your first hero banner to highlight seasonal discounts, new arrivals, or featured collections."
          icon={<ImageIcon className="w-10 h-10 text-slate-400" />}
          actionLabel="Add Banner"
          onAction={handleOpenAdd}
        />
      ) : (
        <BannerTable
          banners={banners}
          onEdit={handleOpenEdit}
          onDelete={(banner) => setBannerToDelete(banner)}
          onToggleActive={handleToggle}
          isLoading={loading}
        />
      )}

      {/* Add / Edit Banner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBanner ? `Edit Banner: ${editingBanner.title}` : "Add New Promotional Banner"}
        description="Configure banner imagery, headlines, call-to-action buttons, and target destination links"
        maxWidth="xl"
      >
        <BannerForm
          initialData={editingBanner}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Single Clean Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(bannerToDelete)}
        onClose={() => setBannerToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Banner"
        message={`Are you sure you want to delete banner "${bannerToDelete?.title}"? It will immediately stop appearing on the storefront carousel.`}
        confirmLabel="Delete Banner"
        isLoading={isDeleting}
        variant="danger"
      />
    </PageContainer>
  );
};

export { BannerList };
export default BannerList;