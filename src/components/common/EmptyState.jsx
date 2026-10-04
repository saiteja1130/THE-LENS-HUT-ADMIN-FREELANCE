import { PackageOpen } from "lucide-react";
import { Button } from "./Button";
const EmptyState = ({
  title = "No records found",
  description = "There are no items to display at this time.",
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  return <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4 border border-slate-100">
        {icon || <PackageOpen className="w-8 h-8 stroke-1" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{description}</p>
      {(actionLabel || secondaryActionLabel) && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {secondaryActionLabel && onSecondaryAction && <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>}
          {actionLabel && onAction && <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>}
        </div>}
    </div>;
};
export {
  EmptyState
};
