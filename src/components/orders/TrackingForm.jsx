import { useState } from "react";
import { Truck, Check } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { formatDateTime } from "../../utils/formatDate";
const TrackingForm = ({
  tracking,
  onSaveTracking
}) => {
  const [courierName, setCourierName] = useState(tracking?.courierName || "");
  const [trackingId, setTrackingId] = useState(tracking?.trackingId || "");
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courierName.trim() || !trackingId.trim()) return;
    setLoading(true);
    try {
      await onSaveTracking(courierName.trim(), trackingId.trim());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setLoading(false);
    }
  };
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-700" />
          Courier & Tracking Details
        </h2>
        {tracking?.updatedAt && <span className="text-[11px] text-slate-400">
            Last updated: {formatDateTime(tracking.updatedAt)}
          </span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
    label="Courier Partner"
    placeholder="e.g. Delhivery, BlueDart, DTDC"
    value={courierName}
    onChange={(e) => setCourierName(e.target.value)}
    required
  />

          <Input
    label="Tracking Number / AWB"
    placeholder="e.g. DLHV-123456789"
    value={trackingId}
    onChange={(e) => setTrackingId(e.target.value)}
    required
  />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-1.5">
              <Check className="w-4 h-4" />
              Tracking details saved
            </span> : <div />}

          <Button
    type="submit"
    variant="primary"
    size="sm"
    isLoading={loading}
    disabled={!courierName.trim() || !trackingId.trim()}
  >
            Save Tracking
          </Button>
        </div>
      </form>
    </div>;
};
export {
  TrackingForm
};
