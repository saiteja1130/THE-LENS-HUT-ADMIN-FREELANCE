import { useState } from "react";
import { 
  Edit, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  List,
  CheckCircle2,
  EyeOff
} from "lucide-react";
import { Modal } from "../common/Modal";
import { BannerPreview } from "./BannerPreview";

const BannerTable = ({
  banners = [],
  onEdit,
  onDelete,
  onToggleActive,
  isLoading = false
}) => {
  const [bannerToPreview, setBannerToPreview] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'

  const fallbackImage =
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="space-y-4">
      {/* View Switcher Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Display Layout:
          </span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "cards"
                  ? "bg-[#14232E] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#14232E] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table List</span>
            </button>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {banners.length} {banners.length === 1 ? "banner" : "banners"} total
        </span>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-card-${idx}`}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs space-y-3 p-4"
              >
                <div className="w-full h-44 bg-slate-200 rounded-xl"></div>
                <div className="h-5 w-2/3 bg-slate-200 rounded"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 min-w-[700px] animate-pulse">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4">Banner Preview</th>
                    <th className="py-3.5 px-4">Title & Copy</th>
                    <th className="py-3.5 px-4">Target Route</th>
                    <th className="py-3.5 px-4">Button CTA</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={`skeleton-row-${idx}`}>
                      <td className="py-4 px-4">
                        <div className="w-28 h-16 bg-slate-200 rounded-lg"></div>
                      </td>
                      <td className="py-4 px-4 space-y-2">
                        <div className="h-4 w-40 bg-slate-200 rounded"></div>
                        <div className="h-3 w-60 bg-slate-200 rounded"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-5 w-24 bg-slate-200 rounded"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-5 w-20 bg-slate-200 rounded"></div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="h-6 w-16 bg-slate-200 rounded-full mx-auto"></div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="h-8 w-20 bg-slate-200 rounded-lg ml-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-semibold text-slate-800">No Banners Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            There are currently no promotional banners configured for the storefront hero carousel.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        /* Visual Cards Showcase View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Card Banner Image Visual Canvas */}
              <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] overflow-hidden bg-[#14232E] text-white flex items-center">
                <img
                  src={banner.imageUrl || fallbackImage}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#14232E] via-[#14232E]/80 to-transparent pointer-events-none" />

                {/* Status Badge Tag on Card */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    type="button"
                    onClick={() => onToggleActive(banner.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md border shadow-xs transition-colors cursor-pointer ${
                      banner.isActive
                        ? "bg-emerald-500/90 text-white border-emerald-400/50 hover:bg-emerald-600"
                        : "bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-900"
                    }`}
                    title="Click to toggle status"
                  >
                    {banner.isActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-100" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 text-slate-400" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Headline & CTA preview */}
                <div className="relative z-10 p-5 sm:p-6 max-w-sm sm:max-w-md">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#E4232C] text-white mb-2 shadow-2xs">
                    Hero Slide
                  </span>
                  <h4 className="text-base sm:text-lg font-bold tracking-tight text-white mb-1 line-clamp-1 drop-shadow-xs">
                    {banner.headline || banner.title}
                  </h4>
                  {banner.subtitle && (
                    <p className="text-xs text-slate-300 mb-3 line-clamp-2 leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#14232E] text-xs font-bold shadow-xs pointer-events-none">
                    <span>{banner.buttonText || "Shop Collection"}</span>
                    <ArrowRight className="w-3 h-3 text-[#E4232C]" />
                  </div>
                </div>
              </div>

              {/* Card Bottom Meta & Actions */}
              <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {banner.title}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-[180px] sm:max-w-[240px]">
                      {banner.link}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
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
                    onClick={() => onDelete(banner)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    aria-label="Delete banner"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Structured Table List View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 min-w-[760px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="py-3.5 px-4 w-36">Preview</th>
                  <th scope="col" className="py-3.5 px-4">Title & Copy</th>
                  <th scope="col" className="py-3.5 px-4">Target Route</th>
                  <th scope="col" className="py-3.5 px-4">CTA Button</th>
                  <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {banners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Generous Aspect-Ratio Preview */}
                    <td className="py-3.5 px-4">
                      <div 
                        onClick={() => setBannerToPreview(banner)}
                        className="relative h-16 w-28 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden cursor-pointer group/thumb shadow-2xs"
                        title="Click to preview storefront banner"
                      >
                        <img
                          src={banner.imageUrl || fallbackImage}
                          alt={banner.title}
                          className="h-full w-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </td>

                    {/* Title & Copy */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-sm">
                        {banner.title}
                      </div>
                      <div className="text-xs font-medium text-[#14232E] mt-0.5 truncate max-w-xs sm:max-w-sm">
                        {banner.headline}
                      </div>
                      {banner.subtitle && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-sm mt-0.5">
                          {banner.subtitle}
                        </div>
                      )}
                    </td>

                    {/* Store Target Route */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                        <span className="truncate max-w-[160px]">{banner.link}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                      </span>
                    </td>

                    {/* CTA Button Text */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800">
                        <span>{banner.buttonText || "Shop Now"}</span>
                        <ArrowRight className="w-3 h-3 text-[#E4232C]" />
                      </span>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleActive(banner.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors border ${
                          banner.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            banner.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{banner.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
                          onClick={() => onDelete(banner)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label="Delete banner"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Storefront Full Preview Modal */}
      <Modal
        isOpen={Boolean(bannerToPreview)}
        onClose={() => setBannerToPreview(null)}
        title="Storefront Banner Preview"
        description="Realistic presentation of hero carousel slide on the live customer storefront"
        maxWidth="2xl"
      >
        {bannerToPreview && <BannerPreview banner={bannerToPreview} />}
      </Modal>
    </div>
  );
};

export { BannerTable };