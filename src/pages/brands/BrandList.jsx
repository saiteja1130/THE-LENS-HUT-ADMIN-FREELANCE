import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Award,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  UploadCloud,
  Loader2,
  ExternalLink,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import { brandService } from "../../services/brandService";
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

export const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const brandFileInputRef = useRef(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);

  const handleLogoUpload = async (file) => {
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(
        `File "${file.name}" exceeds 2MB limit. Please choose a logo under 2MB.`
      );
      return;
    }
    setIsUploadingLogo(true);
    try {
      const data = await uploadService.uploadImage(file, "brands");
      setLogoUrl(data.url);
      toast.success("Brand logo uploaded successfully");
    } catch (err) {
      toast.error(err.message || "Failed to upload brand logo");
    } finally {
      setIsUploadingLogo(false);
      if (brandFileInputRef.current) {
        brandFileInputRef.current.value = "";
      }
    }
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await brandService.getBrandsAdmin();
      setBrands(data);
    } catch {
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setName("");
    setSlug("");
    setDescription("");
    setLogoUrl("");
    setWebsite("");
    setOrder(brands.length + 1);
    setIsActive(true);
    setIsFeatured(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setSlug(brand.slug);
    setDescription(brand.description || "");
    setLogoUrl(brand.logoUrl);
    setWebsite(brand.website || "");
    setOrder(brand.order || 1);
    setIsActive(brand.isActive);
    setIsFeatured(brand.isFeatured);
    setIsModalOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!editingBrand) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Brand name is required");
      return;
    }
    if (!logoUrl) {
      toast.error("Please upload a brand logo");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        logoUrl,
        website: website.trim(),
        order: Number(order),
        isActive,
        isFeatured,
      };

      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id || editingBrand._id, payload);
        toast.success("Brand updated successfully");
      } else {
        await brandService.createBrand(payload);
        toast.success("Brand created successfully");
      }

      setIsModalOpen(false);
      fetchBrands();
    } catch (err) {
      toast.error(err.message || "Failed to save brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (brand) => {
    try {
      await brandService.toggleBrand(brand.id || brand._id);
      toast.success(
        `Brand "${brand.name}" is now ${!brand.isActive ? "Active" : "Inactive"}`
      );
      fetchBrands();
    } catch (err) {
      toast.error(err.message || "Failed to toggle brand status");
    }
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;
    setIsDeleting(true);
    try {
      await brandService.deleteBrand(brandToDelete.id || brandToDelete._id);
      toast.success(`Brand "${brandToDelete.name}" deleted successfully`);
      setBrandToDelete(null);
      fetchBrands();
    } catch (err) {
      toast.error(err.message || "Failed to delete brand");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="h-6 w-6 text-[#E4232C]" />
              Brand Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure eyewear brands, official logos, and catalog filtering
            </p>
          </div>

          <Button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-[#E4232C] hover:bg-[#c91d25] text-white font-bold cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Brand</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <Search size={18} className="text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Search brands by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
        </div>

        {/* Brands Table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader />
          </div>
        ) : filteredBrands.length === 0 ? (
          <EmptyState
            icon={Award}
            title={searchQuery ? "No matching brands" : "No brands added yet"}
            description={
              searchQuery
                ? "Try adjusting your search query."
                : "Create your first brand so products can be dynamically assigned."
            }
            actionLabel={!searchQuery ? "Add Brand" : undefined}
            onAction={!searchQuery ? handleOpenAddModal : undefined}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-[#14232E] text-slate-200 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Brand Logo & Name</th>
                    <th className="px-5 py-3.5">Slug</th>
                    <th className="px-5 py-3.5 text-center">Products</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-center">Featured</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBrands.map((brand) => (
                    <tr key={brand.id || brand._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-slate-50 border border-slate-200/70 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            <img
                              src={brand.logoUrl}
                              alt={brand.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{brand.name}</span>
                            {brand.website && (
                              <a
                                href={brand.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                <span>Website</span>
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        {brand.slug}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {brand.itemCount || 0} {brand.itemCount === 1 ? 'frame' : 'frames'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            brand.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {brand.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        {brand.isFeatured ? (
                          <span className="text-amber-500 font-bold text-xs">★ Featured</span>
                        ) : (
                          <span className="text-slate-400 text-xs">Standard</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(brand)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"
                            title={brand.isActive ? "Deactivate" : "Activate"}
                          >
                            {brand.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(brand)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50 cursor-pointer"
                            title="Edit Brand"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setBrandToDelete(brand)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 rounded-md hover:bg-rose-50 cursor-pointer"
                            title="Delete Brand"
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

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingBrand ? "Edit Eyewear Brand" : "Add New Eyewear Brand"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ray-Ban, Oakley, Gucci"
                value={name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#E4232C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Slug (URL Key) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ray-ban"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#E4232C]"
              />
            </div>

            {/* Brand Logo Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Brand Logo Image *
              </label>
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <div className="h-16 w-24 rounded-lg border border-slate-200 bg-slate-50 p-1 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="h-16 w-24 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                    <Award size={24} />
                  </div>
                )}

                <div className="flex-1">
                  <input
                    type="file"
                    ref={brandFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingLogo}
                    onClick={() => brandFileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 size={13} className="animate-spin text-[#E4232C]" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={13} />
                        <span>{logoUrl ? "Replace Logo" : "Upload Brand Logo"}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 mt-1">
                    PNG, SVG, or WEBP with transparent background recommended (Max 2MB).
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Brand Description
              </label>
              <textarea
                rows={2}
                placeholder="Heritage, craftsmanship, and brand design narrative..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#E4232C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Official Website (Optional)
              </label>
              <input
                type="url"
                placeholder="https://www.example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#E4232C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#E4232C]"
                />
              </div>

              <div className="flex flex-col justify-end space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-[#E4232C] focus:ring-[#E4232C]"
                  />
                  <span className="text-xs font-semibold text-slate-700">Active in Store</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#E4232C] focus:ring-[#E4232C]"
                  />
                  <span className="text-xs font-semibold text-slate-700">Show on Home Page</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploadingLogo}
                className="bg-[#E4232C] hover:bg-[#c91d25] text-white font-bold cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </span>
                ) : editingBrand ? (
                  "Save Changes"
                ) : (
                  "Create Brand"
                )}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={Boolean(brandToDelete)}
          title="Delete Eyewear Brand"
          message={`Are you sure you want to delete "${brandToDelete?.name}"? This action cannot be undone.`}
          confirmLabel={isDeleting ? "Deleting..." : "Delete Brand"}
          isDestructive={true}
          onConfirm={handleDelete}
          onCancel={() => setBrandToDelete(null)}
        />
      </div>
    </PageContainer>
  );
};

export default BrandList;
