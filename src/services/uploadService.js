import { api } from "./api";

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif"
];

export const uploadService = {
  /**
   * Uploads an image to the backend server via Multer
   * @param {File} file - The file to upload
   * @param {string} folder - Destination subfolder (e.g. 'products', 'categories', 'banners')
   * @returns {Promise<{ url: string, filename: string, size: number }>}
   */
  uploadImage: async (file, folder = "general") => {
    if (!file) {
      throw new Error("No file selected.");
    }

    // Client-side 2MB validation
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error("File size exceeds 2MB limit. Please upload an image under 2MB.");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Invalid image format. Supported formats: JPEG, PNG, WEBP, AVIF.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post(`/upload?folder=${encodeURIComponent(folder)}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (res.data?.success && res.data.data?.url) {
      return res.data.data;
    }

    throw new Error(res.data?.message || "Failed to upload image.");
  }
};

