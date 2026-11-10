import { ArrowRight, ExternalLink, Sparkles, CheckCircle2, EyeOff } from "lucide-react";

const BannerPreview = ({ banner }) => {
  if (!banner) return null;

  const fallbackImage =
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1400&q=80";

  return (
    <div className="space-y-4">
      {/* Banner Mock Canvas */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-[#14232E] text-white min-h-[240px] sm:min-h-[280px] flex items-center">
        {/* Background Banner Image */}
        <img
          src={banner.imageUrl || fallbackImage}
          alt={banner.title || "Banner Preview"}
          className="absolute inset-0 w-full h-full object-cover opacity-45 transition-transform duration-700 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />

        {/* Ambient Dark Gradient Overlays for readable typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#14232E] via-[#14232E]/85 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Content Overlay */}
        <div className="relative z-10 p-6 sm:p-10 max-w-xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#E4232C] text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              Featured Showcase
            </span>

            {banner.order !== undefined && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white/90 backdrop-blur-xs">
                Slide #{banner.order}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight drop-shadow-xs">
            {banner.headline || banner.title || "Headline Text"}
          </h3>

          {banner.subtitle && (
            <p className="text-xs sm:text-sm text-slate-200 mb-5 line-clamp-2 max-w-md drop-shadow-xs leading-relaxed">
              {banner.subtitle}
            </p>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#14232E] text-xs font-bold shadow-md hover:bg-slate-100 transition-colors pointer-events-none">
            <span>{banner.buttonText || "Shop Collection"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E4232C]" />
          </div>
        </div>

        {/* Storefront Floating Pill */}
        <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-black/40 text-white/90 backdrop-blur-md border border-white/10 shadow-xs">
          {banner.isActive ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live on Storefront</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Hidden / Draft</span>
            </>
          )}
        </div>
      </div>

      {/* Metadata Bar below Preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Internal Name:</span>
          <span className="text-slate-900 font-medium">{banner.title || "Untitled Banner"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Target Route:</span>
          <span className="inline-flex items-center gap-1 font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            {banner.link || "/"}
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </span>
        </div>
      </div>
    </div>
  );
};

export { BannerPreview };