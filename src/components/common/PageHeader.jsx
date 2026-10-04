import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const PageHeader = ({
  title,
  description,
  backUrl,
  onBack,
  actions
}) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };
  return <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {(backUrl || onBack) && <button
    type="button"
    onClick={handleBack}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer transition-colors shrink-0"
    aria-label="Go back"
  >
            <ArrowLeft className="w-4 h-4" />
          </button>}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {description && <p className="mt-0.5 text-xs sm:text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>;
};
export {
  PageHeader
};
