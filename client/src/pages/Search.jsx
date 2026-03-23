import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    setSidebardata({
      searchTerm: searchTermFromUrl || "",
      type: typeFromUrl || "all",
      parking: parkingFromUrl === "true",
      furnished: furnishedFromUrl === "true",
      offer: offerFromUrl === "true",
      sort: sortFromUrl || "createdAt",
      order: orderFromUrl || "desc",
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
      setShowMore(Array.isArray(data) && data.length > 8);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebardata((prev) => ({ ...prev, type: id }));
      return;
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setSidebardata((prev) => ({ ...prev, [id]: checked }));
      return;
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata((prev) => ({ ...prev, sort, order }));
      return;
    }

    setSidebardata((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", listings.length);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    const nextListings = Array.isArray(data) ? data : [];
    setListings((prev) => [...prev, ...nextListings]);
    if (nextListings.length < 9) {
      setShowMore(false);
    }
  };

  return (
    <section className="page-shell py-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="hero-card h-fit p-6">
          <p className="eyebrow">Filter listings</p>
          <h1 className="mt-3 font-display text-4xl text-slate-950">Discover</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="field-label" htmlFor="searchTerm">
                Search term
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Beach house, loft, skyline..."
                className="mt-2 w-full rounded-[20px] border border-white/60 bg-white/78 px-4 py-3 outline-none transition duration-300 focus:border-[#c96d42]"
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>

            <div>
              <p className="field-label">Type</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[
                  ["all", "All"],
                  ["rent", "Rent"],
                  ["sale", "Sale"],
                ].map(([id, label]) => (
                  <label
                    key={id}
                    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                      sidebardata.type === id
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white/85 text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={id}
                      checked={sidebardata.type === id}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="field-label">Amenities</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[
                  ["offer", "Offer"],
                  ["parking", "Parking"],
                  ["furnished", "Furnished"],
                ].map(([id, label]) => (
                  <label
                    key={id}
                    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                      sidebardata[id]
                        ? "bg-[#c96d42] text-white"
                        : "border border-slate-200 bg-white/85 text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={id}
                      checked={sidebardata[id]}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="sort_order">
                Sort order
              </label>
              <select
                onChange={handleChange}
                value={`${sidebardata.sort}_${sidebardata.order}`}
                id="sort_order"
                className="mt-2 w-full rounded-[20px] border border-white/60 bg-white/78 px-4 py-3 outline-none transition duration-300 focus:border-[#c96d42]"
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>

            <button className="btn-primary w-full justify-center">Apply filters</button>
          </form>
        </aside>

        <div className="space-y-6">
          <div className="hero-card p-6">
            <p className="eyebrow">Results</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-4xl text-slate-950">
                  Listing results
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Premium cards, smoother browsing, and richer property details.
                </p>
              </div>
              <div className="rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700">
                {loading ? "Loading..." : `${listings.length} properties`}
              </div>
            </div>
          </div>

          {!loading && listings.length === 0 && (
            <div className="hero-card p-10 text-center text-slate-600">
              No listings matched these filters.
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>

          {showMore && (
            <div className="flex justify-center">
              <button onClick={onShowMoreClick} className="btn-secondary">
                Show more
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
