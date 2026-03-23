import PropTypes from "prop-types";
import { useState } from "react";
import {
  DEFAULT_LISTING_IMAGE,
  MAX_LISTING_IMAGES,
} from "../utils/listing";

const baseInputClass =
  "w-full rounded-[22px] border border-white/55 bg-white/78 px-4 py-3 text-[15px] text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.08)] outline-none transition duration-300 placeholder:text-slate-400 focus:border-[#c96d42] focus:bg-white focus:shadow-[0_24px_70px_rgba(15,23,42,0.16)]";

const pillButtonClass =
  "rounded-full border px-4 py-2 text-sm font-semibold transition duration-300";

export default function ListingForm({
  mode,
  formData,
  setFormData,
  onSubmit,
  loading,
  error,
  submitLabel,
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");

  const isValidImageUrl = (value) => {
    try {
      const parsedUrl = new URL(value);
      return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  };

  const handleAddImageUrl = () => {
    const trimmedUrl = imageUrl.trim();

    if (!trimmedUrl) {
      setImageUploadError("Enter an image URL first.");
      return;
    }

    if (!isValidImageUrl(trimmedUrl)) {
      setImageUploadError("Enter a valid http or https image URL.");
      return;
    }

    const currentImages = formData.imageUrls.filter(
      (url) => url && url !== DEFAULT_LISTING_IMAGE
    );

    if (currentImages.length >= MAX_LISTING_IMAGES) {
      setImageUploadError(
        `You can add up to ${MAX_LISTING_IMAGES} image URLs per listing.`
      );
      return;
    }

    if (currentImages.includes(trimmedUrl)) {
      setImageUploadError("This image URL is already added.");
      return;
    }

    setImageUploadError("");
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...currentImages, trimmedUrl],
    }));
    setImageUrl("");
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({ ...prev, type: id }));
      return;
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
      return;
    }

    if (type === "number") {
      setFormData((prev) => ({ ...prev, [id]: Number(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const nextImages = prev.imageUrls.filter((_, imageIndex) => imageIndex !== index);
      return {
        ...prev,
        imageUrls:
          nextImages.length > 0 ? nextImages : [DEFAULT_LISTING_IMAGE],
      };
    });
  };

  const visibleImages =
    formData.imageUrls?.length > 0
      ? formData.imageUrls
      : [DEFAULT_LISTING_IMAGE];

  return (
    <section className="page-shell pb-16 pt-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hero-card p-6 sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Listing studio</p>
              <h1 className="mt-3 font-display text-4xl text-slate-950 sm:text-5xl">
                {mode === "create" ? "Create a cinematic listing" : "Refine your listing"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                Strong visuals, tighter copy, and structured details help a property
                convert faster. This editor keeps the whole flow in one place.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-gradient-to-br from-[#fff2c7] via-white/85 to-[#d9f1ff] px-5 py-4 text-left shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                Media setup
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {MAX_LISTING_IMAGES} images max
              </p>
              <p className="text-sm text-slate-600">Paste direct image URLs with live preview</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="name">
                  Title
                </label>
                <input
                  type="text"
                  id="name"
                  className={baseInputClass}
                  placeholder="Oceanfront villa with private dock and sunset lounge"
                  minLength="10"
                  maxLength="62"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className={`${baseInputClass} min-h-[150px] resize-none`}
                  placeholder="Describe the layout, mood, neighborhood, and what makes this place memorable."
                  required
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className={baseInputClass}
                  placeholder="401 Harbor View, Miami, FL"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-white/60 bg-white/62 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <p className="field-label">Listing type</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {["sale", "rent"].map((type) => (
                    <label
                      key={type}
                      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold capitalize transition duration-300 ${
                        formData.type === type
                          ? "bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.24)]"
                          : "border border-slate-200 bg-white/85 text-slate-700 hover:border-[#c96d42] hover:text-[#9f4c24]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={type}
                        checked={formData.type === type}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/60 bg-white/62 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <p className="field-label">Property extras</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[
                    ["parking", "Parking"],
                    ["furnished", "Furnished"],
                    ["offer", "Special offer"],
                  ].map(([id, label]) => (
                    <label
                      key={id}
                      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                        formData[id]
                          ? "bg-[#c96d42] text-white shadow-[0_18px_50px_rgba(201,109,66,0.28)]"
                          : "border border-slate-200 bg-white/85 text-slate-700 hover:border-[#c96d42] hover:text-[#9f4c24]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={id}
                        checked={formData[id]}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["bedrooms", "Bedrooms", 1, 10],
                ["bathrooms", "Bathrooms", 1, 10],
                ["regularPrice", formData.type === "rent" ? "Monthly price" : "Sale price", 50, 100000000],
                ["discountPrice", "Discount price", 0, 100000000],
              ].map(([id, label, min, max]) => {
                if (id === "discountPrice" && !formData.offer) {
                  return null;
                }

                return (
                  <div key={id}>
                    <label className="field-label" htmlFor={id}>
                      {label}
                    </label>
                    <input
                      type="number"
                      id={id}
                      min={min}
                      max={max}
                      className={baseInputClass}
                      value={formData[id]}
                      onChange={handleChange}
                      required={id !== "discountPrice" || formData.offer}
                    />
                  </div>
                );
              })}
            </div>

            <div className="rounded-[32px] border border-white/65 bg-white/68 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="field-label">Gallery</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Add image URLs. If you do not add one, the listing uses a premium default cover.
                  </p>
                </div>
                <p className="rounded-full bg-gradient-to-r from-[#ff7f50] to-[#f9b233] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-[0_12px_28px_rgba(255,127,80,0.28)]">
                  Cover image = first image
                </p>
              </div>

              <div className="mt-5 grid items-end gap-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <label className="field-label" htmlFor="image-url">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`${baseInputClass} mt-2`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="btn-secondary min-w-[190px] justify-center self-end"
                >
                  Add image URL
                </button>
              </div>

              {imageUploadError && (
                <p className="mt-3 text-sm font-medium text-rose-600">
                  {imageUploadError}
                </p>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visibleImages.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="group relative overflow-hidden rounded-[24px] border border-white/70 bg-slate-100"
                  >
                    <img
                      src={url}
                      alt="Listing preview"
                      className="h-48 w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/80 to-transparent px-4 py-4">
                      <p className="text-sm font-semibold text-white">
                        {index === 0 ? "Cover image" : `Image ${index + 1}`}
                      </p>
                      {url !== DEFAULT_LISTING_IMAGE && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className={`${pillButtonClass} border-white/30 bg-white/15 text-white backdrop-blur hover:bg-rose-500`}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Ready to publish
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Review pricing and gallery order before saving.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : submitLabel}
              </button>
            </div>
            {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
          </form>
        </div>

        <aside className="space-y-6">
          <div className="hero-card p-6">
            <p className="eyebrow">Publishing checklist</p>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="rounded-[24px] bg-slate-950 px-4 py-4 text-white">
                Lead with a sharp title and a strong opening sentence.
              </div>
              <div className="rounded-[24px] bg-white/72 px-4 py-4">
                Highlight neighborhood access, furniture, parking, and pricing context.
              </div>
              <div className="rounded-[24px] bg-white/72 px-4 py-4">
                Keep the best photo first. That image drives search card clicks.
              </div>
            </div>
          </div>
          <div className="hero-card p-6">
            <p className="eyebrow">Current setup</p>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-[20px] bg-white/72 px-4 py-3">
                <span>Status</span>
                <span className="font-semibold text-slate-900">
                  {mode === "create" ? "New draft" : "Editing live listing"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-[20px] bg-white/72 px-4 py-3">
                <span>Gallery count</span>
                <span className="font-semibold text-slate-900">
                  {formData.imageUrls?.filter(Boolean).length || 1}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-[20px] bg-white/72 px-4 py-3">
                <span>Offer mode</span>
                <span className="font-semibold text-slate-900">
                  {formData.offer ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

ListingForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  formData: PropTypes.shape({
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    regularPrice: PropTypes.number.isRequired,
    discountPrice: PropTypes.number.isRequired,
    offer: PropTypes.bool.isRequired,
    parking: PropTypes.bool.isRequired,
    furnished: PropTypes.bool.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  submitLabel: PropTypes.string.isRequired,
};

ListingForm.defaultProps = {
  error: "",
};
