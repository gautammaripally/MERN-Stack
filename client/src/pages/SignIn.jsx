import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

const inputClass =
  "w-full rounded-[22px] border border-white/55 bg-white/80 px-4 py-3 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-[#c96d42] focus:bg-white focus:shadow-[0_22px_60px_rgba(15,23,42,0.12)]";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (signInError) {
      dispatch(signInFailure(signInError.message));
    }
  };

  return (
    <section className="page-shell py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hero-card relative overflow-hidden p-8 sm:p-10">
          <div className="orb -right-14 top-8 h-36 w-36 bg-[#f0a884]/35" />
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-4 font-display text-5xl text-slate-950 sm:text-6xl">
            Sign in and manage listings with a sharper workflow.
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-600">
            Your saved listings, profile tools, and new inbox are all behind one
            secure sign-in.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Faster flow
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                Listings, edits, and messages from one profile workspace.
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-950 p-5 text-white shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                Built in
              </p>
              <p className="mt-3 text-lg font-semibold">
                Native in-app messaging without email redirects.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-card p-8 sm:p-10">
          <p className="eyebrow">Account access</p>
          <h2 className="mt-4 font-display text-4xl text-slate-950">
            Sign in
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Email"
              className={inputClass}
              id="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              className={inputClass}
              id="password"
              onChange={handleChange}
            />

            <button
              disabled={loading}
              className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 flex gap-2 text-sm text-slate-600">
            <p>No account yet?</p>
            <Link to="/sign-up" className="font-semibold text-[#9f4c24]">
              Create one
            </Link>
          </div>
          {error && <p className="mt-5 text-sm font-medium text-rose-600">{error}</p>}
        </div>
      </div>
    </section>
  );
}
