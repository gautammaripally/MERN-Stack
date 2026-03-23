import mongoose from "mongoose";

export const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80";

export const MAX_LISTING_IMAGES = 6;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export const isSampleListing = (listing) => {
  if (!listing) {
    return false;
  }

  if (listing.sampleData === true) {
    return true;
  }

  return !mongoose.Types.ObjectId.isValid(listing.userRef);
};

export const normalizeListingImages = (imageUrls = []) => {
  if (!Array.isArray(imageUrls)) {
    return [DEFAULT_LISTING_IMAGE];
  }

  const normalized = imageUrls
    .filter((url) => typeof url === "string" && url.trim().length > 0)
    .slice(0, MAX_LISTING_IMAGES);

  return normalized.length > 0 ? normalized : [DEFAULT_LISTING_IMAGE];
};

export const sanitizeListingPayload = (payload, fallbackUserRef) => {
  const normalizedPayload = {
    ...payload,
    imageUrls: normalizeListingImages(payload.imageUrls),
    userRef: payload.userRef || fallbackUserRef,
  };

  if (!normalizedPayload.offer) {
    normalizedPayload.discountPrice = 0;
  }

  return normalizedPayload;
};
