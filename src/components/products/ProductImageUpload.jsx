import React, { useRef } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";

const ProductImageUpload = ({
  images = { front: "", side: "", angle: "" },
  imageFiles = { front: null, side: null, angle: null },
  onFileChange,
  onUrlChange
}) => {
  const frontInputRef = useRef(null);
  const sideInputRef = useRef(null);
  const angleInputRef = useRef(null);

  const refs = {
    front: frontInputRef,
    side: sideInputRef,
    angle: angleInputRef
  };

  const handleSelectFile = (key, e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(key, file);
    }
  };

  const handleRemoveFile = (key) => {
    if (refs[key]?.current) {
      refs[key].current.value = "";
    }
    onFileChange(key, null);
    if (onUrlChange) {
      onUrlChange(key, "");
    }
  };

  const perspectives = [
    { key: "front", label: "Front View (Primary)", ref: frontInputRef },
    { key: "side", label: "Side View (Temples)", ref: sideInputRef },
    { key: "angle", label: "Angle View (Perspective)", ref: angleInputRef }
  ];

  return (
    <div className="space-y-4">
      <div className="pb-1">
        <span className="text-xs text-slate-500">
          Choose image files from your computer for Front, Side, and Angle perspectives. Images will be uploaded to the server.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {perspectives.map(({ key, label, ref }) => {
          const file = imageFiles[key];
          const previewUrl = file ? URL.createObjectURL(file) : images[key];

          return (
            <div
              key={key}
              className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-150 hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  {label}
                </label>
                {file && (
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    New File
                  </span>
                )}
              </div>

              {/* Preview Container */}
              <div className="relative h-36 w-full rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-2xs group">
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt={label}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(key)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/75 text-white hover:bg-red-600 transition-colors shadow-xs"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-300">
                    <ImageIcon className="w-10 h-10 stroke-1" />
                    <span className="text-[11px] mt-1 text-slate-400">
                      No image selected
                    </span>
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                id={`file-upload-${key}`}
                onChange={(e) => handleSelectFile(key, e)}
              />

              {/* Upload Trigger Button */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor={`file-upload-${key}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-all shadow-2xs"
                >
                  <Upload size={14} className="text-slate-500" />
                  <span>{previewUrl ? "Change File" : "Choose File"}</span>
                </label>
              </div>

              {file && (
                <div className="text-[11px] text-slate-500 truncate" title={file.name}>
                  File: <span className="font-medium text-slate-700">{file.name}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ProductImageUpload };
