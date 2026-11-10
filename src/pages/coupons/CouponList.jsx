import { useState, useMemo } from "react";
import { Plus, Ticket, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
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

  // Compute live coupon metrics for header summary
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const total = coupons.length;
    const active = coupons.filter((c) => c.isActive && c.expiryDate >= today).length;
    const expired = coupons.filter((c) => c.expiryDate < today).length;
    return { total, active, expired };
  }, [coupons]);

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
        toast.success(`Coupon "${data.code}" updated successfully`);
      } else {
        await addCoupon(data);
        toast.success(`Coupon "${data.code}" created successfully`);
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
      await deleteCoupon(couponToDelete.id);
      toast.success(`Coupon "${couponToDelete.code}" deleted successfully`);
      setCouponToDelete(null);
    } catch {
      toast.error("Failed to delete coupon");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer>
      {/* Page Header with Stats Counter */}
      <div className="space-y-4">
        <PageHeader
          title="Coupons"
          description="Create promotional vouchers, cart discount rules, and validity schedules"
          actions={
            <Button
              variant="secondary"
              onClick={handleOpenAdd}
              icon={<Plus className="w-4 h-4" />}
            >
              Create Coupon
            </Button>
          }
        />

        {/* Quick KPI Stat Chips */}
        {!loading && coupons.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Coupons</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.total}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Ticket className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active</span>
                <p className="text-xl font-bold text-emerald-600 mt-0.5">{stats.active}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Expired</span>
                <p className="text-xl font-bold text-rose-600 mt-0.5">{stats.expired}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Table or Empty State */}
      {!loading && coupons.length === 0 ? (
        <EmptyState
          title="No coupons created yet"
          description="Create your first discount coupon code to incentivize shoppers and boost sales conversions."
          icon={<Ticket className="w-10 h-10 text-slate-400" />}
          actionLabel="Create Coupon"
          onAction={handleOpenAdd}
        />
      ) : (
        <CouponTable
          coupons={coupons}
          onEdit={handleOpenEdit}
          onDelete={(coupon) => setCouponToDelete(coupon)}
          isLoading={loading}
        />
      )}

      {/* Add / Edit Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create New Coupon"}
        description="Configure discount percentages, minimum cart requirements, and validity dates"
        maxWidth="lg"
      >
        <CouponForm
          initialData={editingCoupon}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Single Clean Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(couponToDelete)}
        onClose={() => setCouponToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${couponToDelete?.code}"? Customers will no longer be able to apply this discount code at checkout.`}
        confirmLabel="Delete Coupon"
        isLoading={isDeleting}
        variant="danger"
      />
    </PageContainer>
  );
};

export { CouponList };
export default CouponList;