import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { DEFAULT_LISTING_IMAGE, formatPrice } from "../utils/listing";

SwiperCore.use([Navigation, Autoplay]);

const Section = ({ title, subtitle, to, linkLabel, listings }) => {
  if (!listings.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h2 className="mt-3 font-display text-4xl text-slate-950">{title}</h2>
        </div>
        <Link to={to} className="btn-secondary w-fit">
          {linkLabel}
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </section>
  );
};

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const [offersRes, rentRes, saleRes] = await Promise.all([
          fetch("/api/listing/get?offer=true&limit=4"),
          fetch("/api/listing/get?type=rent&limit=4"),
          fetch("/api/listing/get?type=sale&limit=4"),
        ]);

        const [offersData, rentData, saleData] = await Promise.all([
          offersRes.json(),
          rentRes.json(),
          saleRes.json(),
        ]);

        setOfferListings(Array.isArray(offersData) ? offersData : []);
        setRentListings(Array.isArray(rentData) ? rentData : []);
        setSaleListings(Array.isArray(saleData) ? saleData : []);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchAllListings();
  }, []);

  const heroListings = offerListings.length
    ? offerListings
    : [...rentListings, ...saleListings].slice(0, 4);

  return (
    <div className="pb-16">
      <section className="page-shell pt-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="hero-card p-8 sm:p-10">
            <p className="eyebrow">Curated real estate experience</p>
            <h1 className="mt-5 font-display text-5xl leading-none text-slate-950 sm:text-7xl">
              Find a place that looks as refined as it feels.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Browse elevated rentals and sales, create polished listings, and
              message owners without ever leaving the app.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/search" className="btn-primary">
                Explore listings
              </Link>
              <Link to="/create-listing" className="btn-secondary">
                Create a listing
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Instant messaging", "Owners and buyers can chat inside the platform."],
                ["Smooth media flow", "Upload high-quality property images up to 10 MB."],
                ["Sharper discovery", "Animated cards, hero galleries, and faster browsing."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-[26px] border border-white/60 bg-white/78 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
                >
                  <p className="text-lg font-semibold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-card overflow-hidden p-3">
            <Swiper
              navigation
              autoplay={{ delay: 3600, disableOnInteraction: false }}
              className="rounded-[34px]"
            >
              {heroListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div className="relative h-[580px] overflow-hidden rounded-[28px]">
                    <img
                      src={listing.imageUrls?.[0] || DEFAULT_LISTING_IMAGE}
                      alt={listing.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                      <p className="text-xs uppercase tracking-[0.26em] text-white/65">
                        Featured listing
                      </p>
                      <h2 className="mt-4 font-display text-4xl">{listing.name}</h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/76">
                        {listing.description}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-4">
                        <span className="rounded-full bg-white/16 px-4 py-2 text-sm font-semibold backdrop-blur">
                          ${formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
                          {listing.type === "rent" && " / month"}
                        </span>
                        <span className="rounded-full bg-white/16 px-4 py-2 text-sm backdrop-blur">
                          {listing.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="page-shell mt-14">
        <div className="mx-auto max-w-7xl space-y-14">
          <Section
            title="Recent offers"
            subtitle="Hot right now"
            to="/search?offer=true"
            linkLabel="Show more offers"
            listings={offerListings}
          />
          <Section
            title="Places for rent"
            subtitle="Monthly stays"
            to="/search?type=rent"
            linkLabel="Show more rentals"
            listings={rentListings}
          />
          <Section
            title="Places for sale"
            subtitle="Long-term moves"
            to="/search?type=sale"
            linkLabel="Show more homes"
            listings={saleListings}
          />
        </div>
      </section>
    </div>
  );
}
