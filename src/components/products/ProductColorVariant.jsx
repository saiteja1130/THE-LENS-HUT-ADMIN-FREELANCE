import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

const ProductColorVariant = ({ colors = [], onChange }) => {
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#1e293b");
  const [newImages, setNewImages] = useState({
    front: "",
    side: "",
    angle: "",
  });

  const handleImageChange = (key, val) => {
    setNewImages((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;

    const newColor = {
      id: `c-${Date.now().toString(36)}`,
      name: newColorName.trim(),
      hex: newColorHex,
      images: {
        front: newImages.front.trim(),
        side: newImages.side.trim(),
        angle: newImages.angle.trim(),
      },
    };

    onChange([...colors, newColor]);
    setNewColorName("");
    setNewColorHex("#1e293b");
    setNewImages({ front: "", side: "", angle: "" });
  };

  const handleRemoveColor = (id) => {
    onChange(colors.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Configured color variants list */}
      <div className="space-y-3">
        {colors.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No color variants added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {colors.map((color) => {
              const imgs =
                typeof color.images === "object" && color.images !== null && !Array.isArray(color.images)
                  ? color.images
                  : { front: color.images?.[0] || color.image || "", side: color.images?.[1] || "", angle: color.images?.[2] || "" };

              return (
                <div
                  key={color.id || color.name}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between gap-3"
                >
                  {/* Top Bar: Tone, Name, Hex & Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-inner shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-bold text-sm text-slate-900">
                        {color.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {color.hex}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-rose-50 cursor-pointer"
                      title={`Delete ${color.name} variant`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Multi-Angle Images Box */}
                  <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Variant Angles (Front / Side / Angle)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Front */}
                      <div className="flex flex-col items-center">
                        <div className="w-full h-14 rounded-md border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                          {imgs.front ? (
                            <img
                              src={imgs.front}
                              alt={`${color.name} Front`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-[9px] text-slate-300">
                              No front
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 font-medium">
                          Front
                        </span>
                      </div>

                      {/* Side */}
                      <div className="flex flex-col items-center">
                        <div className="w-full h-14 rounded-md border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                          {imgs.side ? (
                            <img
                              src={imgs.side}
                              alt={`${color.name} Side`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-[9px] text-slate-300">
                              No side
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 font-medium">
                          Side
                        </span>
                      </div>

                      {/* Angle */}
                      <div className="flex flex-col items-center">
                        <div className="w-full h-14 rounded-md border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                          {imgs.angle ? (
                            <img
                              src={imgs.angle}
                              alt={`${color.name} Angle`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-[9px] text-slate-300">
                              No angle
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 font-medium">
                          Angle
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Color Variant form */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Add Color Variant & Angles
          </span>
          <span className="text-[11px] text-slate-400">
            Front, Side & Angle matching product perspectives
          </span>
        </div>

        {/* Color Name and Tone Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-8">
            <Input
              label="Color Name *"
              placeholder="e.g. Gunmetal Gray, Matte Silver, Havana Tortoise"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Color Tone
            </label>
            <div className="flex items-center gap-2 h-9 px-2 bg-white rounded-lg border border-slate-300">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-6 h-6 rounded border-0 p-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-slate-600 font-medium">
                {newColorHex}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Perspectives: Front, Side, Angle */}
        <div className="space-y-2 pt-1 border-t border-slate-200/60">
          <span className="text-[11px] font-bold text-slate-700 block">
            Perspective Image URLs:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Front View */}
            <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">
                  Front View (Primary)
                </span>
                {newImages.front && (
                  <img
                    src={newImages.front}
                    alt="Front Preview"
                    className="w-6 h-5 object-contain rounded border"
                  />
                )}
              </div>
              <Input
                placeholder="https://... Front URL"
                value={newImages.front}
                onChange={(e) => handleImageChange("front", e.target.value)}
              />
            </div>

            {/* Side View */}
            <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">
                  Side View (Temples)
                </span>
                {newImages.side && (
                  <img
                    src={newImages.side}
                    alt="Side Preview"
                    className="w-6 h-5 object-contain rounded border"
                  />
                )}
              </div>
              <Input
                placeholder="https://... Side URL"
                value={newImages.side}
                onChange={(e) => handleImageChange("side", e.target.value)}
              />
            </div>

            {/* Angle View */}
            <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">
                  Angle View (Perspective)
                </span>
                {newImages.angle && (
                  <img
                    src={newImages.angle}
                    alt="Angle Preview"
                    className="w-6 h-5 object-contain rounded border"
                  />
                )}
              </div>
              <Input
                placeholder="https://... Angle URL"
                value={newImages.angle}
                onChange={(e) => handleImageChange("angle", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit Variant Button */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ImageIcon size={13} />
            <span>
              Clicking this color will display its matching Front, Side & Angle
              photos
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddColor}
            disabled={!newColorName.trim()}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Color Variant
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ProductColorVariant };
export default ProductColorVariant;
