import { ChevronLeft, ChevronRight } from "lucide-react";
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}) => {
  if (totalPages <= 1) {
    return <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl text-xs text-slate-500">
        <span>Showing {totalItems} total {totalItems === 1 ? "result" : "results"}</span>
      </div>;
  }
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl gap-3">
      <div className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{startItem}</span> to{" "}
        <span className="font-medium text-slate-700">{endItem}</span> of{" "}
        <span className="font-medium text-slate-700">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1">
        <button
    onClick={() => onPageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
    aria-label="Previous Page"
  >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pages.map((p) => {
    const isActive = p === currentPage;
    return <button
      key={p}
      onClick={() => onPageChange(p)}
      className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium cursor-pointer transition-colors ${isActive ? "bg-[#E4232C] text-white font-semibold shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
    >
                {p}
              </button>;
  })}
        </div>

        <button
    onClick={() => onPageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
    aria-label="Next Page"
  >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>;
};
export {
  Pagination
};
