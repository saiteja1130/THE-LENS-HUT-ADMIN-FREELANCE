/**
 * Resolves a prescription or uploaded file URL for the admin panel.
 * Handles full URLs (http/https), relative paths (/uploads/...), and raw filenames.
 */
export const resolveFileUrl = (urlOrPath) => {
  if (!urlOrPath || typeof urlOrPath !== 'string') return '';
  const trimmed = urlOrPath.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  const backendBase = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');

  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${backendBase}${clean}`;
  }

  // If it's just a filename (e.g., storedFilename from upload)
  return `${backendBase}/uploads/prescriptions/${trimmed.replace(/^\/+/, '')}`;
};

