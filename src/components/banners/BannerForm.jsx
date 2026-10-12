import { useForm } from "react-hook-form";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
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
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      headline: initialData?.headline || "",
      subtitle: initialData?.subtitle || "",
      buttonText: initialData?.buttonText || "Shop Collection",
      link: initialData?.link || "/products?category=Eyeglasses",
      imageUrl: initialData?.imageUrl || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80",
      isActive: initialData?.isActive ?? true
    }
  });
  const currentImageUrl = watch("imageUrl");
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
  return <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
    label="Target Link (Route or URL)"
    placeholder="e.g. /products?category=Eyeglasses"
    required
    error={errors.link?.message}
    {...register("link", { required: "Link is required" })}
  />

        <Input
    label="Banner Image URL"
    placeholder="https://images.unsplash.com/..."
    required
    error={errors.imageUrl?.message}
    {...register("imageUrl", { required: "Image URL is required" })}
  />
      </div>

      {
    /* Image Preview thumbnail */
  }
      {currentImageUrl && <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50 h-28 flex items-center justify-center">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>}

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
    disabled={isLoading}
  >
          Cancel
        </Button>

        <Button
    type="submit"
    variant="primary"
    isLoading={isLoading}
  >
          {initialData ? "Save Changes" : "Save Banner"}
        </Button>
      </div>
    </form>;
};
export {
  BannerForm
};
