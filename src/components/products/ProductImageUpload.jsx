import { Image as ImageIcon, Sparkles } from "lucide-react";
import { Input } from "../common/Input";
const ProductImageUpload = ({
  images,
  onChange
}) => {
  const handleChange = (key, value) => {
    onChange({
      ...images,
      [key]: value
    });
  };
  const setSampleEyewearImages = () => {
    onChange({
      front: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    });
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          Enter image URLs for Front, Side, and Angle perspectives.
        </span>
        <button
    type="button"
    onClick={setSampleEyewearImages}
    className="inline-flex items-center gap-1 text-xs text-[#b58d24] hover:text-[#967417] font-semibold cursor-pointer"
  >
          <Sparkles className="w-3.5 h-3.5" />
          Load Sample Optical Images
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {
    /* Front View */
  }
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
          <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Front View (Primary)
          </label>
          <div className="h-32 w-full rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
            {images.front ? <img
    src={images.front}
    alt="Front View"
    className="h-full w-full object-cover"
    onError={(e) => {
      e.target.src = "https://placehold.co/400x300?text=Invalid+Image+URL";
    }}
  /> : <div className="flex flex-col items-center text-slate-300">
                <ImageIcon className="w-8 h-8 stroke-1" />
                <span className="text-[11px] mt-1">No front image</span>
              </div>}
          </div>
          <Input
    placeholder="https://... (Front view URL)"
    value={images.front}
    onChange={(e) => handleChange("front", e.target.value)}
  />
        </div>

        {
    /* Side View */
  }
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
          <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Side View (Temples)
          </label>
          <div className="h-32 w-full rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
            {images.side ? <img
    src={images.side}
    alt="Side View"
    className="h-full w-full object-cover"
    onError={(e) => {
      e.target.src = "https://placehold.co/400x300?text=Invalid+Image+URL";
    }}
  /> : <div className="flex flex-col items-center text-slate-300">
                <ImageIcon className="w-8 h-8 stroke-1" />
                <span className="text-[11px] mt-1">No side image</span>
              </div>}
          </div>
          <Input
    placeholder="https://... (Side view URL)"
    value={images.side}
    onChange={(e) => handleChange("side", e.target.value)}
  />
        </div>

        {
    /* Angle View */
  }
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
          <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Angle View (Perspective)
          </label>
          <div className="h-32 w-full rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
            {images.angle ? <img
    src={images.angle}
    alt="Angle View"
    className="h-full w-full object-cover"
    onError={(e) => {
      e.target.src = "https://placehold.co/400x300?text=Invalid+Image+URL";
    }}
  /> : <div className="flex flex-col items-center text-slate-300">
                <ImageIcon className="w-8 h-8 stroke-1" />
                <span className="text-[11px] mt-1">No angle image</span>
              </div>}
          </div>
          <Input
    placeholder="https://... (Angle view URL)"
    value={images.angle}
    onChange={(e) => handleChange("angle", e.target.value)}
  />
        </div>
      </div>
    </div>;
};
export {
  ProductImageUpload
};
