import { useState } from "react";
import { Plus, Ticket } from "lucide-react";
import { toast } from "react-toastify";
import { useCoupons } from "../../hooks/useCoupons";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { CouponTable } from "../../components/coupons/CouponTable";
import { CouponForm } from "../../components/coupons/CouponForm";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";
const CouponList = () => {
  const { coupons, loading, addCoupon, updateCoupon, deleteCoupon } = useCoupons();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, data);
        toast.success("Coupon updated");
      } else {
        await addCoupon(data);
        toast.success("Coupon created");
      }
      handleCloseModal();
    } catch {
      toast.error("Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCoupon(couponToDelete);
      toast.success("Coupon deleted successfully");
      setCouponToDelete(null);
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setIsDeleting(false);
    }
  };
  return <PageContainer>
      <PageHeader
    title="Coupons"
    description="Discount promo codes, minimum cart values, and expiration rules"
    actions={<Button
      variant="secondary"
      onClick={handleOpenAdd}
      icon={<Plus className="w-4 h-4" />}
    >
            Create Coupon
          </Button>}
  />

      {!loading && coupons.length === 0 ? <EmptyState
    title="No coupons found"
    description="There are currently no discount vouchers created for the store."
    icon={<Ticket className="w-8 h-8 text-slate-400" />}
    actionLabel="Create Coupon"
    onAction={handleOpenAdd}
  /> : <CouponTable
    coupons={coupons}
    onEdit={handleOpenEdit}
    onDelete={(id) => setCouponToDelete(id)}
    isLoading={loading}
  />}

      {
    /* Add / Edit Coupon Modal */
  }
      <Modal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    title={editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create New Coupon"}
    description="Configure discount percentages, threshold values, and validity window"
    maxWidth="md"
  >
        <CouponForm
    initialData={editingCoupon}
    onSubmit={handleSubmit}
    onCancel={handleCloseModal}
    isLoading={isSubmitting}
  />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(couponToDelete)}
        onClose={() => setCouponToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Coupon"
        message="Are you sure you want to remove this discount coupon? Customers will no longer be able to apply it at checkout."
        confirmLabel="Delete Coupon"
        isLoading={isDeleting}
        variant="danger"
      />
    </PageContainer>;
};
var stdin_default = CouponList;
export {
  CouponList,
  stdin_default as default
};
