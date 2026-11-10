import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { 
  UploadCloud, 
  Loader2, 
  Image as ImageIcon, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  FileCheck
} from "lucide-react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { uploadService, MAX_IMAGE_SIZE_BYTES } from "../../services/uploadService";

const BannerForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      headline: initialData?.headline || "",
      subtitle: initialData?.subtitle || "",
      buttonText: initialData?.buttonText || "Shop Collection",
      link: initialData?.link || "/products?category=Eyeglasses",
      imageUrl: initialData?.imageUrl || "",
      isActive: initialData?.isActive ?? true
    }
  });

  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const bannerFileRef = useRef(null);

  const watchedImageUrl = watch("imageUrl");
  const watchedHeadline = watch("headline");
  const watchedTitle = watch("title");
  const watchedSubtitle = watch("subtitle");
  const watchedButtonText = watch("buttonText");
  const watchedIsActive = watch("isActive");

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(`File "${file.name}" exceeds 2MB limit. Please upload an image under 2MB.`);
      return;
    }

    setIsUploading(true);
    try {
      const data = await uploadService.uploadImage(file, "banners");
      setValue("imageUrl", data.url, { shouldValidate: true });
      toast.success("Banner image uploaded successfully to server");
    } catch (err) {
      toast.error(err.message || "Failed to upload banner image");
    } finally {
      setIsUploading(false);
      if (bannerFileRef.current) {
        bannerFileRef.current.value = "";
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setValue("imageUrl", "", { shouldValidate: true });
  };

  const onFormSubmit = async (data) => {
    await onSubmit({
      title: data.title.trim(),
      headline: data.headline.trim(),
      subtitle: data.subtitle.trim(),
      buttonText: data.buttonText.trim(),
      link: data.link.trim(),
      imageUrl: data.imageUrl.trim(),
      isActive: Boolean(data.isActive)
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Live Mini Banner Preview */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            Live Preview
          </span>
          <span className="text-[11px] text-slate-400 font-normal normal-case">
            Visual preview of storefront hero card
          </span>
        </div>

        <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-[#14232E] text-white min-h-[160px] sm:min-h-[180px] flex items-center shadow-xs">
          {watchedImageUrl ? (
            <img
              src={watchedImageUrl}
              alt="Banner Preview"
              className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-300"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#14232E] via-slate-800 to-[#14232E] opacity-50" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#14232E] via-[#14232E]/80 to-transparent pointer-events-none" />

          <div className="relative z-10 p-4 sm:p-6 max-w-md">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#E4232C] text-white mb-2 shadow-2xs">
              Hero Showcase
            </span>
            <h4 className="text-base sm:text-lg font-bold tracking-tight text-white mb-1 line-clamp-1">
              {watchedHeadline || watchedTitle || "Your Headline Here"}
            </h4>
            <p className="text-xs text-slate-300 mb-3 line-clamp-1">
              {watchedSubtitle || "Promotional subtitle copy will appear here"}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-[#14232E] text-xs font-bold shadow-xs">
              <span>{watchedButtonText || "Shop Collection"}</span>
              <ArrowRight className="w-3 h-3 text-[#E4232C]" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Identification & Route */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          General Details & Navigation
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Internal Banner Title"
            placeholder="e.g. Autumn Eyewear Showcase 2026"
            required
            helperText="Admin identification name (not shown to buyers)"
            error={errors.title?.message}
            {...register("title", { required: "Banner title is required" })}
          />

          <Input
            label="Target Link (Route or URL)"
            placeholder="e.g. /products?category=Eyeglasses"
            required
            helperText="Where customer navigates when clicking banner"
            error={errors.link?.message}
            {...register("link", { required: "Link is required" })}
          />
        </div>
      </div>

      {/* Section 2: Storefront Copy & Button */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Customer-Facing Headlines & CTA
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Display Headline"
            placeholder="e.g. See Clearly, Live Boldly"
            required
            helperText="Prominent bold text on hero slide"
            error={errors.headline?.message}
            {...register("headline", { required: "Headline is required" })}
          />

          <Input
            label="Button CTA Text"
            placeholder="e.g. Shop Eyeglasses"
            required
            helperText="Label on the interactive action button"
            error={errors.buttonText?.message}
            {...register("buttonText", { required: "Button text is required" })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Subtitle / Promotional Description
          </label>
          <textarea
            rows={2}
            className="block w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm py-2 px-3 transition-colors placeholder:text-slate-400 focus:border-[#E4232C] focus:outline-none focus:ring-2 focus:ring-[#E4232C]/20"
            placeholder="e.g. Flat 30% off on premium Japanese Titanium frames with anti-reflective coating."
            {...register("subtitle")}
          />
          <p className="mt-1 text-xs text-slate-500">
            Secondary descriptive copy placed underneath the headline.
          </p>
        </div>
      </div>

      {/* Section 3: Banner Image Upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Banner Image Asset <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Multer Server Storage • Max 2MB
          </span>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-4 text-center transition-all ${
            dragActive
              ? "border-[#E4232C] bg-red-50/50"
              : "border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400"
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            ref={bannerFileRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-600">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#E4232C]" />
              ) : (
                <UploadCloud className="w-5 h-5 text-slate-500" />
              )}
            </div>

            <div className="text-xs">
              <span className="font-semibold text-slate-800">
                {isUploading ? "Uploading image to server..." : "Click to upload banner"}
              </span>
              <span className="text-slate-500"> or drag and drop</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Recommended: 1920 × 600px (16:9 or 21:9 ratio) • JPG, PNG, WEBP, AVIF up to 2MB
            </p>

            <button
              type="button"
              disabled={isUploading}
              onClick={() => bannerFileRef.current?.click()}
              className="mt-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            >
              Browse Files
            </button>
          </div>
        </div>

        {/* Image URL fallback input */}
        <div className="pt-1">
          <Input
            placeholder="Or enter direct banner image URL"
            required
            helperText="Direct image URL will be saved if no new file is uploaded"
            error={errors.imageUrl?.message}
            {...register("imageUrl", { required: "Banner image URL is required" })}
          />
        </div>

        {/* Existing Image Thumbnail Preview with Remove Control */}
        {watchedImageUrl && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-16 h-10 rounded-md bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                <img
                  src={watchedImageUrl}
                  alt="Uploaded Asset"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Image selected</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
                  {watchedImageUrl}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveImage}
              title="Remove image"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Section 4: Publishing Toggle Card */}
      <div className="pt-1">
        <label className="relative flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer select-none">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="h-4.5 w-4.5 rounded border-slate-300 text-[#14232E] focus:ring-[#14232E] cursor-pointer"
              {...register("isActive")}
            />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-slate-900 block text-sm">
              Publish banner on storefront carousel
            </span>
            <span className="text-slate-500 mt-0.5 block">
              When checked, this banner will rotate actively in the homepage showcase hero.
            </span>
          </div>
        </label>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || isUploading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || isUploading}
          icon={!isLoading ? <CheckCircle2 className="w-4 h-4" /> : null}
        >
          {initialData ? "Save Changes" : "Create Banner"}
        </Button>
      </div>
    </form>
  );
};

export { BannerForm };