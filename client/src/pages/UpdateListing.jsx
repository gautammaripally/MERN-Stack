import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ListingForm from "../components/ListingForm";
import { normalizeImageUrls } from "../utils/listing";

const emptyFormData = {
  imageUrls: [],
  name: "",
  description: "",
  address: "",
  type: "rent",
  bedrooms: 1,
  bathrooms: 1,
  regularPrice: 50,
  discountPrice: 0,
  offer: false,
  parking: false,
  furnished: false,
};

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState(emptyFormData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          setPageLoading(false);
          return;
        }

        setFormData({
          ...emptyFormData,
          ...data,
          imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
        });
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setPageLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (+formData.regularPrice < +formData.discountPrice) {
      setError("Discount price must be lower than the regular price.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrls: normalizeImageUrls(formData.imageUrls),
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <section className="page-shell pb-16 pt-10">
        <div className="hero-card mx-auto max-w-3xl p-10 text-center">
          <p className="eyebrow">Loading</p>
          <h1 className="mt-4 font-display text-4xl text-slate-950">
            Fetching listing details
          </h1>
        </div>
      </section>
    );
  }

  return (
    <ListingForm
      mode="edit"
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      submitLabel="Update listing"
    />
  );
}
