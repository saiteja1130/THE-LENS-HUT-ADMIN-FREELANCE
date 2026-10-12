import { useState } from "react";
import { Edit, Trash2, Eye, ExternalLink } from "lucide-react";
import { Table } from "../common/Table";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { Modal } from "../common/Modal";
import { BannerPreview } from "./BannerPreview";
const BannerTable = ({
  banners,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading = false
}) => {
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [bannerToPreview, setBannerToPreview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(bannerToDelete.id);
    } finally {
      setIsDeleting(false);
      setBannerToDelete(null);
    }
  };
  const columns = [
    {
      header: "Preview",
      className: "w-24",
      render: (banner) => <div className="h-12 w-20 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="h-full w-full object-cover"
          />
        </div>
    },
    {
      header: "Title & Headline",
      render: (banner) => <div>
          <div className="font-semibold text-slate-900">{banner.title}</div>
          <div className="text-xs text-slate-500 truncate max-w-xs">{banner.headline}</div>
        </div>
    },
    {
      header: "Store Link",
      render: (banner) => <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          <span>{banner.link}</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </span>
    },
    {
      header: "Button Text",
      accessor: "buttonText",
      className: "text-xs text-slate-600"
    },
    {
      header: "Status",
      render: (banner) => <button
        type="button"
        onClick={() => onToggleActive(banner.id)}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${banner.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}
        title="Click to toggle status"
      >
          {banner.isActive ? "Active" : "Inactive"}
        </button>
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (banner) => <div className="flex items-center justify-end gap-1.5">
          <button
        type="button"
        onClick={() => setBannerToPreview(banner)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Preview banner"
        title="Preview Banner"
      >
            <Eye className="w-4 h-4" />
          </button>

          <button
        type="button"
        onClick={() => onEdit(banner)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Edit banner"
        title="Edit Banner"
      >
            <Edit className="w-4 h-4" />
          </button>

          <button
        type="button"
        onClick={() => setBannerToDelete(banner)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        aria-label="Delete banner"
        title="Delete Banner"
      >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
    }
  ];
  return <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <Table
    columns={columns}
    data={banners}
    keyExtractor={(item) => item.id}
    isLoading={isLoading}
  />
      </div>

      <ConfirmDialog
    isOpen={!!bannerToDelete}
    onClose={() => setBannerToDelete(null)}
    onConfirm={handleConfirmDelete}
    title="Delete Banner"
    message={`Are you sure you want to delete banner "${bannerToDelete?.title}"?`}
    confirmLabel="Delete Banner"
    cancelLabel="Cancel"
    variant="danger"
    isLoading={isDeleting}
  />

      <Modal
    isOpen={!!bannerToPreview}
    onClose={() => setBannerToPreview(null)}
    title="Storefront Banner Preview"
    maxWidth="2xl"
  >
        {bannerToPreview && <BannerPreview banner={bannerToPreview} />}
      </Modal>
    </>;
};
export {
  BannerTable
};
