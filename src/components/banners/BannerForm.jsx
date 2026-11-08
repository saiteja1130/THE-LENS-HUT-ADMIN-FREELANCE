import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UploadCloud, Loader2 } from "lucide-react";
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
  const bannerFileRef = useRef(null);
  const currentImageUrl = watch("imageUrl");

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

  const onFormSubmit = async (data) => {
    await onSubmit({
      title: data.title.trim(),
      headline: data.headline.trim(),
      subtitle: data.subtitle.trim(),
      buttonText: data.buttonText.trim(),
      link: data.link.trim(),
      imageUrl: data.imageUrl.trim(),
      isActive: data.isActive
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
        label="Internal Banner Title"
        placeholder="e.g. Autumn Eyewear Showcase 2026"
        required
        error={errors.title?.message}
        {...register("title", { required: "Banner title is required" })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Headline"
          placeholder="e.g. See Clearly, Live Boldly"
          required
          error={errors.headline?.message}
          {...register("headline", { required: "Headline is required" })}
        />

        <Input
          label="Button CTA Text"
          placeholder="e.g. Shop Eyeglasses"
          required
          error={errors.buttonText?.message}
          {...register("buttonText", { required: "Button text is required" })}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Subtitle / Promotional Copy
        </label>
        <textarea
          rows={2}
          className="block w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm py-2 px-3 transition-colors placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/10"
          placeholder="e.g. Flat 30% off on premium Japanese Titanium frames with anti-reflective coating."
          {...register("subtitle")}
        />
      </div>

      <Input
        label="Target Link (Route or URL)"
        placeholder="e.g. /products?category=Eyeglasses"
        required
        error={errors.link?.message}
        {...register("link", { required: "Link is required" })}
      />

      {/* Banner Image Upload (Multer, Max 2MB) */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800">
            Banner Image *
          </label>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Multer Server Storage • Max 2MB
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            ref={bannerFileRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => bannerFileRef.current?.click()}
            className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#E4232C]" />
                <span>Uploading to Server (Max 2MB)...</span>
              </>
            ) : (
              <>
                <UploadCloud size={14} className="text-slate-500" />
                <span>Upload Banner Image File (Max 2MB)</span>
              </>
            )}
          </button>

          <Input
            placeholder="Or enter complete server image URL"
            required
            error={errors.imageUrl?.message}
            {...register("imageUrl", { required: "Banner image URL is required" })}
          />
        </div>
      </div>

      {/* Image Preview thumbnail */}
      {currentImageUrl && (
        <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50 h-32 flex items-center justify-center">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      )}

      <div className="pt-2">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-800"
            {...register("isActive")}
          />
          <span className="text-sm font-medium text-slate-800">
            Publish banner on homepage carousel
          </span>
        </label>
      </div>

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
        >
          {initialData ? "Save Changes" : "Create Banner"}
        </Button>
      </div>
    </form>
  );
};

export { BannerForm };
