import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ListingForm from "../components/ListingForm";
import { normalizeImageUrls } from "../utils/listing";

const initialFormData = {
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

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (+formData.regularPrice < +formData.discountPrice) {
      setError("Discount price must be lower than the regular price.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/listing/create", {
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

  return (
    <ListingForm
      mode="create"
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      submitLabel="Create listing"
    />
  );
}
