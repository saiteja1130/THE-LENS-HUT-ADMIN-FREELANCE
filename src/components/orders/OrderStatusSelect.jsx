import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ORDER_STATUSES, getOrderStatusColor } from "../../utils/orderStatus";
import { ConfirmDialog } from "../common/ConfirmDialog";

const OrderStatusSelect = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const colors = getOrderStatusColor(currentStatus);

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

  return (
    <>
      <div className="relative inline-flex items-center">
        <select
          value={currentStatus}
          onChange={handleSelectChange}
          disabled={disabled || loading}
          className={`cursor-pointer appearance-none rounded-lg border py-1.5 pl-3 pr-7 text-xs font-semibold shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50 ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-white text-slate-800">
              {status}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-2 h-3.5 w-3.5 ${colors.text} opacity-70`}
        />
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
        cancelLabel="Keep Order"
        variant="danger"
        isLoading={loading}
      />
    </>
  );
};

export { OrderStatusSelect };
