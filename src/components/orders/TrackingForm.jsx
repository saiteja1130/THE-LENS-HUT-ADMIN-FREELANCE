import { useState } from "react";
import { Truck, Check } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { formatDateTime } from "../../utils/formatDate";

const TrackingForm = ({ tracking, onSaveTracking }) => {
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

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all sm:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Truck className="h-4 w-4 text-[#E4232C]" />
          Courier & Tracking Details
        </h2>
        {tracking?.updatedAt && (
          <span className="text-[11px] font-medium text-slate-500">
            Last updated: {formatDateTime(tracking.updatedAt)}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          {savedSuccess ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <Check className="h-4 w-4" />
              Tracking details saved successfully
            </span>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            variant="secondary"
            size="sm"
            isLoading={loading}
            disabled={!courierName.trim() || !trackingId.trim()}
            className="shadow-xs"
          >
            Save Tracking
          </Button>
        </div>
      </form>
    </div>
  );
};

export { TrackingForm };
