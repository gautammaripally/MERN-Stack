import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUnreadCount } from "../redux/user/userSlice";

export default function Header() {
  const { currentUser, unreadCount } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setSearchTerm(urlParams.get("searchTerm") || "");
  }, [location.search]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!currentUser) {
        dispatch(setUnreadCount(0));
        return;
      }

      try {
        const res = await fetch("/api/message/unread-count");
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        dispatch(setUnreadCount(data.unreadCount || 0));
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUnreadCount();
  }, [currentUser, location.pathname, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-[rgba(248,249,255,0.72)] backdrop-blur-2xl">
      <div className="page-shell py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-[32px] border border-white/65 bg-white/58 px-4 py-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="group">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff7f50] via-[#ff5f6d] to-[#7c5cff] text-lg font-bold text-white shadow-[0_20px_45px_rgba(255,95,109,0.24)]">
                  RE
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Estate platform
                  </p>
                  <h1 className="font-display text-2xl text-slate-950 transition duration-300 group-hover:text-[#db5f34]">
                    Real Estate
                  </h1>
                </div>
              </div>
            </Link>

            <Link
              to="/profile"
              className="relative flex items-center lg:hidden"
              aria-label="Profile"
            >
              {currentUser ? (
                <>
                  <img
                    className="h-11 w-11 rounded-2xl object-cover ring-2 ring-white"
                    src={currentUser.avatar}
                    alt="Profile"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#c96d42] px-1.5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(201,109,66,0.35)]">
                      {unreadCount}
                    </span>
                  )}
                </>
              ) : (
                <span className="btn-secondary px-4 py-2">Sign in</span>
              )}
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-1 items-center gap-3 rounded-[26px] border border-white/65 bg-white/85 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          >
            <FaSearch className="text-slate-400" />
            <input
              type="text"
              placeholder="Search homes, towers, districts..."
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-primary whitespace-nowrap px-4 py-2 text-sm">
              Search
            </button>
          </form>

          <div className="hidden items-center gap-3 lg:flex">
            {[
              ["/", "Home"],
              ["/search", "Discover"],
              ["/about", "About"],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#ff7f50] via-[#ff5f6d] to-[#7c5cff] text-white shadow-[0_18px_40px_rgba(255,95,109,0.22)]"
                      : "text-slate-600 hover:bg-white hover:text-[#db5f34]"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <Link to="/profile" className="relative ml-2 flex items-center">
              {currentUser ? (
                <>
                  <img
                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                    src={currentUser.avatar}
                    alt="Profile"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#c96d42] px-1.5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(201,109,66,0.35)]">
                      {unreadCount}
                    </span>
                  )}
                </>
              ) : (
                <span className="btn-secondary px-5 py-2">Sign in</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
