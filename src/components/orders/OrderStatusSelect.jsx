import { useState } from "react";
import { ORDER_STATUSES } from "../../utils/orderStatus";
import { ConfirmDialog } from "../common/ConfirmDialog";
const OrderStatusSelect = ({
  currentStatus,
  onStatusChange,
  disabled = false
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === currentStatus) return;
    if (selected === "Cancelled") {
      setPendingStatus("Cancelled");
      setIsConfirmOpen(true);
    } else {
      executeChange(selected);
    }
  };
  const executeChange = async (status) => {
    setLoading(true);
    try {
      await onStatusChange(status);
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
      setPendingStatus(null);
    }
  };
  const handleConfirmCancel = () => {
    if (pendingStatus) {
      executeChange(pendingStatus);
    }
  };
  return <>
      <div className="relative inline-block">
        <select
    value={currentStatus}
    onChange={handleSelectChange}
    disabled={disabled || loading}
    className="rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs font-semibold text-slate-800 shadow-2xs hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/20 cursor-pointer disabled:opacity-50"
  >
          {ORDER_STATUSES.map((status) => <option key={status} value={status}>
              {status}
            </option>)}
        </select>
      </div>

      <ConfirmDialog
    isOpen={isConfirmOpen}
    onClose={() => {
      setIsConfirmOpen(false);
      setPendingStatus(null);
    }}
    onConfirm={handleConfirmCancel}
    title="Cancel Order Confirmation"
    message="Are you sure you want to cancel this order? This action will mark the order as Cancelled."
    confirmLabel="Yes, Cancel Order"
    cancelLabel="Cancel"
    variant="danger"
    isLoading={loading}
  />
    </>;
};
export {
  OrderStatusSelect
};
