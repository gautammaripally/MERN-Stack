import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const inputClass =
  "w-full rounded-[22px] border border-white/55 bg-white/80 px-4 py-3 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-[#c96d42] focus:bg-white focus:shadow-[0_22px_60px_rgba(15,23,42,0.12)]";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (signUpError) {
      setLoading(false);
      setError(signUpError.message);
    }
  };

  return (
    <section className="page-shell py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="hero-card p-8 sm:p-10">
          <p className="eyebrow">Create account</p>
          <h1 className="mt-4 font-display text-5xl text-slate-950 sm:text-6xl">
            Launch a profile built for premium real-estate publishing.
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-600">
            Create listings, edit them later, and receive buyer or renter messages
            inside your dashboard.
          </p>
          <div className="mt-10 space-y-4">
            <div className="rounded-[24px] bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              Richer listing editor with smoother media handling.
            </div>
            <div className="rounded-[24px] bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              Mongo-backed in-app conversations instead of email redirects.
            </div>
            <div className="rounded-[24px] bg-slate-950 p-5 text-white shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
              Inbox alerts shown directly on the profile icon.
            </div>
          </div>
        </div>

        <div className="hero-card p-8 sm:p-10">
          <p className="eyebrow">Register</p>
          <h2 className="mt-4 font-display text-4xl text-slate-950">
            Sign up
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Username"
              className={inputClass}
              id="username"
              onChange={handleChange}
            />
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
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="mt-6 flex gap-2 text-sm text-slate-600">
            <p>Already registered?</p>
            <Link to="/sign-in" className="font-semibold text-[#9f4c24]">
              Sign in
            </Link>
          </div>
          {error && <p className="mt-5 text-sm font-medium text-rose-600">{error}</p>}
        </div>
      </div>
    </section>
  );
}
