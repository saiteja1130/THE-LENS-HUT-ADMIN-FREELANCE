import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false
}) => {
  return <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="sm:flex sm:items-start gap-4">
        <div
    className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${variant === "danger" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}
  >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <h3 className="text-base font-semibold leading-6 text-slate-900">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-slate-500">{message}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
    variant={variant === "danger" ? "danger" : "primary"}
    onClick={onConfirm}
    isLoading={isLoading}
  >
          {confirmLabel}
        </Button>
      </div>
    </Modal>;
};
export {
  ConfirmDialog
};
