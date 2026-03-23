import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const isObjectId = (value = "") => /^[0-9a-fA-F]{24}$/.test(value);

const cardClass =
  "rounded-[28px] border border-white/65 bg-white/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]";

export default function Contact({ listing, onMessageSent }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sampleListing = useMemo(
    () => listing.sampleData || !isObjectId(listing.userRef),
    [listing.sampleData, listing.userRef]
  );

  useEffect(() => {
    const fetchLandlord = async () => {
      if (sampleListing) {
        setLandlord({
          username: "Sample listing host",
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setLandlord(data);
      } catch (fetchError) {
        setError("Unable to load listing owner details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLandlord();
  }, [listing.userRef, sampleListing]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError("Type a message before sending.");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");
      const res = await fetch("/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listing._id,
          receiverRef: listing.userRef,
          body: message,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setSending(false);
        return;
      }

      setSuccess("Message sent. The owner can now see it in Profile.");
      setMessage("");
      onMessageSent();
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className={cardClass}>Loading contact panel...</div>;
  }

  return (
    <div className={cardClass}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Direct message
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            Contact {landlord?.username || "property owner"}
          </h3>
        </div>
        {sampleListing && (
          <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Demo listing
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Send a message about <span className="font-semibold">{listing.name}</span>.
      </p>

      <textarea
        name="message"
        id="message"
        rows="4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about availability, pricing flexibility, or schedule a visit."
        className="mt-5 min-h-[140px] w-full rounded-[24px] border border-white/60 bg-slate-50/80 p-4 text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-[#c96d42] focus:bg-white"
      />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={sending}
          className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send message"}
        </button>
        {success && <p className="text-sm font-medium text-emerald-600">{success}</p>}
        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
      </div>
    </div>
  );
}

Contact.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    sampleData: PropTypes.bool,
  }).isRequired,
  onMessageSent: PropTypes.func,
};

Contact.defaultProps = {
  onMessageSent: () => {},
};
