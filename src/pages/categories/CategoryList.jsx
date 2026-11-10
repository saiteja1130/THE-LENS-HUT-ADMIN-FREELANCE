import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Layers,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { categoryService } from "../../services/categoryService";
import {
  uploadService,
  MAX_IMAGE_SIZE_BYTES,
} from "../../services/uploadService";
import { PageContainer } from "../../components/layout/PageContainer";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const catFileInputRef = useRef(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);

  const handleCategoryFileUpload = async (file) => {
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(
        `File "${file.name}" exceeds 2MB limit. Please choose an image under 2MB.`
      );
      return;
    }
    setIsUploadingImage(true);
    try {
      const data = await uploadService.uploadImage(file, "categories");
      setImageUrl(data.url);
      toast.success("Category image uploaded successfully");
    } catch (err) {
      toast.error(err.message || "Failed to upload category image");
    } finally {
      setIsUploadingImage(false);
      if (catFileInputRef.current) {
        catFileInputRef.current.value = "";
      }
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setSubtitle("");
    setDescription("");
    setImageUrl("/images/home/cat-eyeglasses.png");
    setLink("/shop");
    setOrder(categories.length + 1);
    setIsActive(true);
    setIsFeatured(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || "");
    setSlug(cat.slug || "");
    setSubtitle(cat.subtitle || "");
    setDescription(cat.description || "");
    setImageUrl(cat.imageUrl || "");
    setLink(cat.link || "");
    setOrder(cat.order !== undefined ? cat.order : 1);
    setIsActive(cat.isActive !== undefined ? cat.isActive : true);
    setIsFeatured(cat.isFeatured !== undefined ? cat.isFeatured : true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleToggle = async (id) => {
    try {
      const updated = await categoryService.toggleCategory(id);
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, isActive: updated.isActive } : c
        )
      );
      toast.success("Category status updated");
    } catch {
      toast.error("Failed to toggle category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        subtitle: subtitle.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || "/images/home/cat-eyeglasses.png",
        link: link.trim() || `/${name.toLowerCase().replace(/\s+/g, "-")}`,
        order: Number(order) || 1,
        isActive,
        isFeatured,
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, payload);
        toast.success("Category updated successfully");
      } else {
        await categoryService.createCategory(payload);
        toast.success("Category created successfully");
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(categoryToDelete);
      toast.success("Category deleted");
      setCategoryToDelete(null);
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Categories
            </h1>
            {!loading && (
              <span className="inline-flex items-center rounded-full border border-slate-200/80 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {categories.length}{" "}
                {categories.length === 1 ? "Category" : "Categories"}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage product categories (Eyeglasses, Sunglasses, Contact Lenses,
            Accessories) displayed on Web and Mobile
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={handleOpenAdd}
            icon={<Plus className="h-4 w-4" />}
            className="shadow-xs"
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Main Content: Loading, Empty State, or Categories Table */}
      {loading ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-slate-200/80 bg-white p-12 shadow-xs">
          <Loader message="Loading categories..." />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="There are currently no categories configured for the catalog."
          icon={<Layers className="h-8 w-8 text-slate-400" />}
          actionLabel="Add Category"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-5">Image</th>
                  <th className="py-3.5 px-4">Category Details</th>
                  <th className="py-3.5 px-4">Slug & Route</th>
                  <th className="py-3.5 px-4 text-center">Order</th>
                  <th className="py-3.5 px-4 text-center">Home Featured</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    {/* Visual Preview */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex h-12 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50 p-1 shadow-2xs">
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/home/cat-eyeglasses.png";
                          }}
                        />
                      </div>
                    </td>

                    {/* Name & Subtitle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="block text-left text-sm font-bold text-slate-900 transition-colors hover:text-[#E4232C] cursor-pointer"
                      >
                        {cat.name}
                      </button>
                      <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                        {cat.subtitle || cat.description || "—"}
                      </div>
                    </td>

                    {/* Slug & Target Route */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block rounded-md border border-slate-200/80 bg-slate-100/80 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
                        {cat.slug}
                      </span>
                      <div className="mt-1 max-w-[160px] truncate font-mono text-xs text-slate-400">
                        {cat.link || `/${cat.slug}`}
                      </div>
                    </td>

                    {/* Display Order */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block rounded-full border border-slate-200/60 bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-700 shadow-2xs">
                        #{cat.order || 0}
                      </span>
                    </td>

                    {/* Home Featured Indicator */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-2xs ${
                          cat.isFeatured
                            ? "border-emerald-200/70 bg-emerald-50 text-emerald-700"
                            : "border-slate-200/70 bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            cat.isFeatured ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{cat.isFeatured ? "Featured" : "Standard"}</span>
                      </span>
                    </td>

                    {/* Active Status & Quick Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(cat.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                          cat.isActive
                            ? "border-emerald-200/80 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80"
                            : "border-rose-200/80 bg-rose-50 text-rose-800 hover:bg-rose-100/80"
                        }`}
                        title="Click to toggle storefront visibility"
                      >
                        {cat.isActive ? (
                          <Eye className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5 text-rose-600" />
                        )}
                        <span>{cat.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="rounded-lg border border-transparent p-1.5 text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-2xs"
                          title="Edit Category"
                          aria-label="Edit Category"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(cat.id)}
                          className="rounded-lg border border-transparent p-1.5 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer shadow-2xs"
                          title="Delete Category"
                          aria-label="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          editingCategory
            ? `Edit Category: ${editingCategory.name}`
            : "Create New Category"
        }
        description="Configure product category details, route link, and display priority"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Category Name <span className="text-[#E4232C]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCategory) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }
                }}
                placeholder="e.g. Eyeglasses"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E4232C] focus:outline-none focus:ring-2 focus:ring-[#E4232C]/20 transition-colors"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                URL Slug <span className="text-[#E4232C]">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. eyeglasses"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E4232C] focus:outline-none focus:ring-2 focus:ring-[#E4232C]/20 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Subtitle / Slogan
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Classic / Modern / Everyday"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E4232C] focus:outline-none focus:ring-2 focus:ring-[#E4232C]/20 transition-colors"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E4232C] focus:outline-none focus:ring-2 focus:ring-[#E4232C]/20 transition-colors"
              />
            </div>
          </div>

          {/* Category Image Upload (Multer, Max 2MB) */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-3 sm:p-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800">
                Category Image <span className="text-[#E4232C]">*</span>
              </label>
              <span className="rounded-full border border-emerald-200/70 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                Multer Storage • Max 2MB
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Category Preview"
                    className="h-full w-full object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Layers className="h-6 w-6 text-slate-300" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  ref={catFileInputRef}
                  className="hidden"
                  onChange={(e) =>
                    handleCategoryFileUpload(e.target.files?.[0])
                  }
                />
                <button
                  type="button"
                  disabled={isUploadingImage}
                  onClick={() => catFileInputRef.current?.click()}
                  className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2
                        className="animate-spin text-[#E4232C]"
                        size={13}
                      />
                      <span>Uploading to Server (Max 2MB)...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="text-slate-500" size={14} />
                      <span>Upload Category Image File (Max 2MB)</span>
                    </>
                  )}
                </button>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste server image URL"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[#E4232C] focus:outline-none focus:ring-2 focus:ring-[#E4232C]/20 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Target Route Link
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="e.g. /eyeglasses or /shop"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E4232C] focus:outline-none focus:ring-2 focus:ring-[#E4232C]/20 transition-colors"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of products included in this category..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E4232C] focus:outline-none focus:ring-2 focus:ring-[#E4232C]/20 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#E4232C] cursor-pointer"
              />
              <span>Active in Storefront</span>
            </label>

            <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#E4232C] cursor-pointer"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="outline" type="button" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              type="submit"
              isLoading={isSubmitting}
              className="shadow-xs"
            >
              {editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products assigned to it may need reassignment."
        confirmLabel="Delete Category"
        isLoading={isDeleting}
        variant="danger"
      />
    </PageContainer>
  );
};

export default CategoryList;
