import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { DEFAULT_LISTING_IMAGE, formatPrice } from "../utils/listing";

export default function ListingItem({ listing }) {
  const coverImage = listing.imageUrls?.[0] || DEFAULT_LISTING_IMAGE;

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/78 shadow-[0_22px_70px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={coverImage}
          alt="Listing cover"
          className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 backdrop-blur">
            {listing.type === "rent" ? "For rent" : "For sale"}
          </span>
          {listing.offer && (
            <span className="rounded-full bg-[#c96d42] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_24px_rgba(201,109,66,0.35)]">
              ${formatPrice(+listing.regularPrice - +listing.discountPrice)} off
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900 transition duration-300 group-hover:text-[#9f4c24]">
            {listing.name}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <MdLocationOn className="text-lg text-[#c96d42]" />
            <p className="truncate">{listing.address}</p>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-7 text-slate-600">
          {listing.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold text-slate-950">
              ${formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
              {listing.type === "rent" && (
                <span className="ml-1 text-sm font-medium text-slate-500">
                  / month
                </span>
              )}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {listing.bedrooms} bed • {listing.bathrooms} bath
            </p>
          </div>
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            View
            <FaArrowRightLong className="transition duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    offer: PropTypes.bool.isRequired,
    discountPrice: PropTypes.number.isRequired,
    regularPrice: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
  }).isRequired,
};
