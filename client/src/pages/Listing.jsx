import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaCar,
  FaChair,
  FaLocationDot,
  FaShareNodes,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import { DEFAULT_LISTING_IMAGE, formatPrice } from "../utils/listing";

SwiperCore.use([Navigation, Autoplay]);

const detailCardClass =
  "rounded-[28px] border border-white/60 bg-white/78 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (fetchError) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const detailItems = useMemo(() => {
    if (!listing) {
      return [];
    }

    return [
      [FaBed, `${listing.bedrooms} ${listing.bedrooms > 1 ? "beds" : "bed"}`],
      [FaBath, `${listing.bathrooms} ${listing.bathrooms > 1 ? "baths" : "bath"}`],
      [FaCar, listing.parking ? "Parking included" : "No parking"],
      [FaChair, listing.furnished ? "Furnished" : "Unfurnished"],
    ];
  }, [listing]);

  if (loading) {
    return (
      <section className="page-shell py-10">
        <div className="hero-card mx-auto max-w-4xl p-10 text-center">
          <p className="eyebrow">Loading</p>
          <h1 className="mt-4 font-display text-4xl text-slate-950">
            Preparing listing details
          </h1>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell py-10">
        <div className="hero-card mx-auto max-w-4xl p-10 text-center text-rose-600">
          Something went wrong while loading this listing.
        </div>
      </section>
    );
  }

  if (!listing) {
    return null;
  }

  const gallery =
    Array.isArray(listing.imageUrls) && listing.imageUrls.length > 0
      ? listing.imageUrls
      : [DEFAULT_LISTING_IMAGE];

  return (
    <section className="page-shell py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="hero-card overflow-hidden p-3">
          <Swiper
            navigation
            autoplay={{ delay: 3800, disableOnInteraction: false }}
            className="rounded-[34px]"
          >
            {gallery.map((url, index) => (
              <SwiperSlide key={`${url}-${index}`}>
                <div className="relative h-[560px] overflow-hidden rounded-[28px]">
                  <img
                    src={url}
                    alt={listing.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="hero-card p-8 sm:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                      {listing.type === "rent" ? "For rent" : "For sale"}
                    </span>
                    {listing.offer && (
                      <span className="rounded-full bg-[#c96d42] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                        ${formatPrice(+listing.regularPrice - +listing.discountPrice)} off
                      </span>
                    )}
                  </div>
                  <h1 className="mt-5 font-display text-5xl text-slate-950 sm:text-6xl">
                    {listing.name}
                  </h1>
                  <div className="mt-4 flex items-center gap-2 text-slate-500">
                    <FaLocationDot className="text-[#c96d42]" />
                    <p>{listing.address}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="btn-secondary gap-2"
                >
                  <FaShareNodes />
                  Share
                </button>
              </div>

              {copied && (
                <p className="mt-4 text-sm font-medium text-emerald-600">
                  Listing link copied.
                </p>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {detailItems.map(([Icon, text]) => (
                  <div key={text} className={detailCardClass}>
                    <Icon className="text-xl text-[#c96d42]" />
                    <p className="mt-4 text-lg font-semibold text-slate-900">{text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[30px] bg-slate-950 p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.18)]">
                <p className="text-xs uppercase tracking-[0.26em] text-white/60">
                  Pricing
                </p>
                <p className="mt-3 text-4xl font-semibold">
                  ${formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
                  {listing.type === "rent" && (
                    <span className="ml-2 text-lg font-medium text-white/70">
                      / month
                    </span>
                  )}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="hero-card p-6">
              <p className="eyebrow">Property snapshot</p>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-[22px] bg-white/78 px-4 py-4">
                  <span>Bedrooms</span>
                  <span className="font-semibold text-slate-950">{listing.bedrooms}</span>
                </div>
                <div className="flex items-center justify-between rounded-[22px] bg-white/78 px-4 py-4">
                  <span>Bathrooms</span>
                  <span className="font-semibold text-slate-950">{listing.bathrooms}</span>
                </div>
                <div className="flex items-center justify-between rounded-[22px] bg-white/78 px-4 py-4">
                  <span>Parking</span>
                  <span className="font-semibold text-slate-950">
                    {listing.parking ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-[22px] bg-white/78 px-4 py-4">
                  <span>Furnished</span>
                  <span className="font-semibold text-slate-950">
                    {listing.furnished ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <div className="hero-card p-6">
                <p className="eyebrow">Reach owner</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                  Ask about this property
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Send a direct message from inside the app. The conversation will
                  appear in the owner&apos;s profile inbox.
                </p>
                <button onClick={() => setContact(true)} className="btn-primary mt-6">
                  Open message box
                </button>
              </div>
            )}

            {contact && <Contact listing={listing} />}
          </div>
        </div>
      </div>
    </section>
  );
}
