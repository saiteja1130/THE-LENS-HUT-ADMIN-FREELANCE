import { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { uploadService, MAX_IMAGE_SIZE_BYTES } from "../../services/uploadService";

const ProductColorVariant = ({ colors = [], onChange }) => {
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#1e293b");
  const [newImages, setNewImages] = useState({
    front: "",
    side: "",
    angle: "",
  });

  const [uploadingState, setUploadingState] = useState({
    front: false,
    side: false,
    angle: false,
  });

  const fileInputRefs = {
    front: useRef(null),
    side: useRef(null),
    angle: useRef(null),
  };

  const handleImageChange = (key, val) => {
    setNewImages((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleFileUpload = async (key, file) => {
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(
        `File "${file.name}" exceeds the 2MB size limit. Please upload an image under 2MB.`
      );
      return;
    }

    setUploadingState((prev) => ({ ...prev, [key]: true }));
    try {
      const data = await uploadService.uploadImage(file, "products");
      handleImageChange(key, data.url);
      toast.success(
        `${key.charAt(0).toUpperCase() + key.slice(1)} image uploaded successfully`
      );
    } catch (err) {
      toast.error(err.message || "Failed to upload image to server.");
    } finally {
      setUploadingState((prev) => ({ ...prev, [key]: false }));
      if (fileInputRefs[key]?.current) {
        fileInputRefs[key].current.value = "";
      }
    }
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
            No color variants added yet. Add a variant below with its color tone and perspective photos.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {colors.map((color) => {
              const imgs =
                typeof color.images === "object" &&
                color.images !== null &&
                !Array.isArray(color.images)
                  ? color.images
                  : {
                      front:
                        color.images?.[0] || color.image || "",
                      side: color.images?.[1] || "",
                      angle: color.images?.[2] || "",
                    };

              return (
                <div
                  key={color.id || color.name}
                  className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:border-slate-300 flex flex-col justify-between gap-3.5"
                >
                  {/* Top Bar: Tone, Name, Hex & Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-4.5 w-4.5 rounded-full border border-slate-300/80 shadow-2xs shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-bold text-sm text-slate-900">
                        {color.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                        {color.hex}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer shadow-2xs"
                      title={`Delete ${color.name} variant`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Multi-Angle Images Box */}
                  <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Variant Perspectives
                    </span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {/* Front */}
                      <div className="flex flex-col items-center">
                        <div className="w-full h-14 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shadow-2xs">
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
                            <span className="text-[10px] text-slate-300">
                              No front
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 font-medium truncate max-w-full">
                          Front
                        </span>
                      </div>

                      {/* Side */}
                      <div className="flex flex-col items-center">
                        <div className="w-full h-14 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shadow-2xs">
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
                            <span className="text-[10px] text-slate-300">
                              No side
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 font-medium truncate max-w-full">
                          Side
                        </span>
                      </div>

                      {/* Angle */}
                      <div className="flex flex-col items-center">
                        <div className="w-full h-14 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shadow-2xs">
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
                            <span className="text-[10px] text-slate-300">
                              No angle
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 font-medium truncate max-w-full">
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
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Add Color Variant & Angles
          </span>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 shadow-2xs">
            Multer Storage • Max 2MB per image
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
            <div className="flex items-center gap-2.5 h-9.5 px-3 bg-white rounded-lg border border-slate-300 shadow-2xs">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-6 h-6 rounded border-0 p-0 cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-slate-700 font-medium">
                {newColorHex}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Perspectives: Front, Side, Angle */}
        <div className="space-y-2.5 pt-2 border-t border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 block">
              Perspective Images:
            </span>
            <span className="text-[10px] text-slate-400">
              Upload local file (max 2MB) or paste server URL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Front View */}
            <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">
                  Front View (Primary) *
                </span>
                {newImages.front && (
                  <img
                    src={newImages.front}
                    alt="Front Preview"
                    className="w-7 h-6 object-contain rounded border border-slate-200"
                  />
                )}
              </div>

              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  ref={fileInputRefs.front}
                  className="hidden"
                  onChange={(e) => handleFileUpload("front", e.target.files?.[0])}
                />
                <button
                  type="button"
                  disabled={uploadingState.front}
                  onClick={() => fileInputRefs.front.current?.click()}
                  className="w-full py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {uploadingState.front ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-[#E4232C]" />
                      <span>Uploading (Max 2MB)...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={13} className="text-slate-500" />
                      <span>Upload File (Max 2MB)</span>
                    </>
                  )}
                </button>
              </div>

              <Input
                placeholder="Or paste server image URL"
                value={newImages.front}
                onChange={(e) => handleImageChange("front", e.target.value)}
              />
            </div>

            {/* Side View */}
            <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">
                  Side View (Temples)
                </span>
                {newImages.side && (
                  <img
                    src={newImages.side}
                    alt="Side Preview"
                    className="w-7 h-6 object-contain rounded border border-slate-200"
                  />
                )}
              </div>

              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  ref={fileInputRefs.side}
                  className="hidden"
                  onChange={(e) => handleFileUpload("side", e.target.files?.[0])}
                />
                <button
                  type="button"
                  disabled={uploadingState.side}
                  onClick={() => fileInputRefs.side.current?.click()}
                  className="w-full py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {uploadingState.side ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-[#E4232C]" />
                      <span>Uploading (Max 2MB)...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={13} className="text-slate-500" />
                      <span>Upload File (Max 2MB)</span>
                    </>
                  )}
                </button>
              </div>

              <Input
                placeholder="Or paste server image URL"
                value={newImages.side}
                onChange={(e) => handleImageChange("side", e.target.value)}
              />
            </div>

            {/* Angle View */}
            <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">
                  Angle View (Perspective)
                </span>
                {newImages.angle && (
                  <img
                    src={newImages.angle}
                    alt="Angle Preview"
                    className="w-7 h-6 object-contain rounded border border-slate-200"
                  />
                )}
              </div>

              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  ref={fileInputRefs.angle}
                  className="hidden"
                  onChange={(e) => handleFileUpload("angle", e.target.files?.[0])}
                />
                <button
                  type="button"
                  disabled={uploadingState.angle}
                  onClick={() => fileInputRefs.angle.current?.click()}
                  className="w-full py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {uploadingState.angle ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-[#E4232C]" />
                      <span>Uploading (Max 2MB)...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={13} className="text-slate-500" />
                      <span>Upload File (Max 2MB)</span>
                    </>
                  )}
                </button>
              </div>

              <Input
                placeholder="Or paste server image URL"
                value={newImages.angle}
                onChange={(e) => handleImageChange("angle", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit Variant Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ImageIcon size={13} />
            <span>
              Perspective photos will be saved to the server and linked to this color variant
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddColor}
            disabled={!newColorName.trim()}
            icon={<Plus className="w-4 h-4" />}
            className="shadow-xs"
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
