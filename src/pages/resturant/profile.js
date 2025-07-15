import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import RestaurantLayout from "@/components/RestaurantLayout";
import { useRouter } from "next/router";

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialFormData, setInitialFormData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    mealType: "",
    facilities: [],
  });

  const router = useRouter();

  const isFormChanged =
    JSON.stringify(initialFormData) !== JSON.stringify(formData);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect immediately if no token
    if (!token) {
      router.replace("/resturant/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/resturant/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.restaurant;
        setRestaurant(data);
        const initialData = {
          name: data.restaurant.name,
          address: data.restaurant.address,
          city: data.restaurant.city,
          country: data.restaurant.country,
          zipCode: data.restaurant.zipCode,
          mealType: data.restaurant.mealType.join(", "),
          facilities: data.restaurant.facilities || [],
        };
        setFormData(initialData);
        setInitialFormData(initialData);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, value]
        : prev.facilities.filter((facility) => facility !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/resturant/login"); // Redirect if no token before submitting
      return;
    }

    try {
      const response = await axios.put(
        "/api/resturant/profile",
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully!");
      setRestaurant(response.data.restaurant);
      setInitialFormData(formData);
      setProcessing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <RestaurantLayout>
      <ProfileStyled>
        <div className="profile-container">
          <h2>About Owner/Manager</h2>
          <p>
            <strong>Name:</strong> {restaurant.user.name}
          </p>
          <p>
            <strong>Email:</strong> {restaurant.user.email}
          </p>
          <p>
            <strong>Phone:</strong> {restaurant.user.phone}
          </p>
          <p>
            <strong>Status:</strong> {restaurant.user.role}
          </p>
          <p>
            <strong>CNIC:</strong> {restaurant.user.cnic}
          </p>

          <h2>About Restaurant</h2>
          <form onSubmit={handleSubmit}>
            <label>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Address:</strong>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>City:</strong>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Country:</strong>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Zip Code:</strong>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <strong>Meal Type:</strong>
              <input
                type="text"
                name="mealType"
                value={formData.mealType}
                onChange={handleInputChange}
                placeholder="e.g., Italian, Fast Food"
              />
            </label>
            <fieldset>
              <legend>
                <strong>Facilities:</strong>
              </legend>
              {["dineIn", "pickUp", "delivery", "reservations"].map(
                (facility) => (
                  <label key={facility}>
                    <input
                      type="checkbox"
                      value={facility}
                      checked={formData.facilities.includes(facility)}
                      onChange={handleCheckboxChange}
                    />
                    {facility}
                  </label>
                )
              )}
            </fieldset>
            <button type="submit" disabled={!isFormChanged}>
              {processing ? "Updating" : "Update Profile"}
            </button>
          </form>
        </div>
      </ProfileStyled>
    </RestaurantLayout>
  );
};

export default RestaurantProfile;

const ProfileStyled = styled.div`
  padding: 20px;
  font-family: Poppins, sans-serif;
  background-color: white;
  border-radius: 20px;
  /* margin-top: 10px; */
  min-height: 100vh;

  h2 {
    margin-bottom: 20px;
    margin-top: 30px;
    color: #052855;
  }

  .profile-container {
    p {
      margin: 10px 0;
      strong {
        color: #052855;
      }
      color: gray;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;

      label {
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: 14px;
        color: #052855;
        input {
          height: 35px;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
          outline: none;
        }
      }

      fieldset {
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        gap: 30px;
        legend {
          color: #052855;
          padding-left: 10px;
          padding-right: 10px;
        }
        input {
          height: 10px;
        }
      }

      button {
        padding: 10px;
        background-color: #052855;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        &:hover:not(:disabled) {
          background-color: #041a3c;
        }
      }
    }
  }
`;
