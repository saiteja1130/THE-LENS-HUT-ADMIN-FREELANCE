import { useState, useEffect } from "react";
import { Plus, Layers, Edit2, Trash2, Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { categoryService } from "../../services/categoryService";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        prev.map((c) => (c.id === id ? { ...c, isActive: updated.isActive } : c))
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
      <PageHeader
        title="Categories"
        description="Manage product categories (Eyeglasses, Sunglasses, Contact Lenses, Accessories) displayed on Web and Mobile."
        actions={
          <Button
            variant="secondary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Category
          </Button>
        }
      />

      {!loading && categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="There are currently no categories configured for the catalog."
          icon={<Layers className="w-8 h-8 text-slate-400" />}
          actionLabel="Add Category"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Category Details</th>
                  <th className="py-3 px-4">Slug & Route</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-center">Home Featured</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Visual Preview */}
                    <td className="py-3 px-4">
                      <div className="w-14 h-12 rounded-xl bg-slate-100 border border-slate-200/60 p-1 flex items-center justify-center overflow-hidden">
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/images/home/cat-eyeglasses.png";
                          }}
                        />
                      </div>
                    </td>

                    {/* Name & Subtitle */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#14232E]">{cat.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">
                        {cat.subtitle || cat.description || "—"}
                      </div>
                    </td>

                    {/* Slug & Target Route */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {cat.slug}
                      </span>
                      <div className="text-xs text-slate-400 mt-0.5">{cat.link || `/${cat.slug}`}</div>
                    </td>

                    {/* Display Order */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">
                        #{cat.order || 0}
                      </span>
                    </td>

                    {/* Home Featured Indicator */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          cat.isFeatured
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cat.isFeatured ? "Featured" : "Standard"}
                      </span>
                    </td>

                    {/* Active Status & Quick Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggle(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          cat.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                        }`}
                        title="Click to toggle visibility"
                      >
                        {cat.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{cat.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#14232E] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(cat.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
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
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
        description="Configure product category details, route link, and display priority"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category Name *
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
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#14232E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. eyeglasses"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#14232E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subtitle / Slogan
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Classic / Modern / Everyday"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#14232E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#14232E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Image URL *
              </label>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/home/cat-eyeglasses.png or HTTPS URL"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#14232E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Route Link
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /eyeglasses or /shop"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#14232E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of products included in this category..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#14232E]"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 accent-[#E4232C] cursor-pointer"
              />
              <span>Active in Storefront</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 accent-[#E4232C] cursor-pointer"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="secondary" type="submit" loading={isSubmitting}>
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
