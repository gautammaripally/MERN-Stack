export const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80";

export const MAX_LISTING_IMAGES = 6;

export const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

export const normalizeImageUrls = (imageUrls = []) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return [DEFAULT_LISTING_IMAGE];
  }

  return imageUrls.filter(Boolean).slice(0, MAX_LISTING_IMAGES);
};
