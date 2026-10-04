import { ArrowRight } from "lucide-react";

const BannerPreview = ({ banner }) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-[#14232E] text-white min-h-[200px] flex items-center">
      {/* Background Image with dark gradient overlay */}
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        onError={(e) => {
          e.target.src =
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#14232E] via-[#14232E]/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 max-w-lg">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#E4232C] text-white shadow-xs mb-2">
          Featured Showcase
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-2 leading-tight">
          {banner.headline || banner.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-4 line-clamp-2">
          {banner.subtitle}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#14232E] text-xs font-bold shadow-sm">
          <span>{banner.buttonText || "Shop Now"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export { BannerPreview };
