import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";
const ErrorMessage = ({
  title = "Something went wrong",
  message = "We could not complete your request. Please try again.",
  onRetry
}) => {
  return <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900">{title}</h3>
      <p className="mt-1 text-sm text-rose-700 max-w-md mx-auto">{message}</p>
      {onRetry && <div className="mt-4">
          <Button
    variant="outline"
    size="sm"
    onClick={onRetry}
    icon={<RefreshCw className="w-3.5 h-3.5" />}
  >
            Try Again
          </Button>
        </div>}
    </div>;
};
export {
  ErrorMessage
};
