export default function About() {
  return (
    <section className="page-shell py-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="hero-card p-8 sm:p-10">
          <p className="eyebrow">About the platform</p>
          <h1 className="mt-4 font-display text-5xl text-slate-950 sm:text-6xl">
            Real estate discovery with a sharper product experience.
          </h1>
          <p className="mt-6 text-base leading-8 text-slate-600">
            This platform is built to make buying, renting, and publishing feel
            more modern. Listings are richer, owner communication is native, and
            the entire interface is designed to feel premium without getting slow.
          </p>
        </div>

        <div className="grid gap-5">
          {[
            [
              "Curated UI",
              "Large visual moments, cinematic cards, layered surfaces, and motion that stays smooth instead of noisy.",
            ],
            [
              "Creator workflow",
              "Owners can create, edit, and delete their listings while managing media and profile settings from one place.",
            ],
            [
              "Inbox built in",
              "Property questions are stored in the database and shown inside profile instead of opening an external mail app.",
            ],
          ].map(([title, text], index) => (
            <div
              key={title}
              className={`hero-card p-6 ${index === 1 ? "lg:translate-x-8" : ""}`}
            >
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                0{index + 1}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
