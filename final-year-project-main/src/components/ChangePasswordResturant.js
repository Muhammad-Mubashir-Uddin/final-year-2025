import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styled from "styled-components";

const ChangePassword = () => {
  const initialState = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [update, setUpdate] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize router for navigation

  // Function to check if any field has changed from initial state
  const isFormChanged = () => {
    return Object.keys(formData).some(
      (key) => formData[key] !== initialState[key]
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdate(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage

      if (!token) {
        router.push("/resturant/login");
      }

      const response = await axios.post(
        "/api/resturant/changePassword",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.message);

      // Clear the form and reset state
      setFormData(initialState);
      localStorage.removeItem("token");

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/resturant/login");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setUpdate(false);
    }
  };

  return (
    <PasswordStyled>
      <div className="container">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={!isFormChanged() || update}>
            {update ? "Updating..." : "Update Password"}
          </button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </PasswordStyled>
  );
};

export default ChangePassword;

const PasswordStyled = styled.div`
  h2 {
    color: #052855;
    margin-bottom: 20px;
  }
  form {
    display: flex;
    flex-direction: column;
    /* width: 30%; */
    input {
      margin-bottom: 10px;
      height: 40px;
      padding-left: 10px;
      border: 1px solid #ddd;
      outline: none;
      border-radius: 10px;
    }
    button {
      height: 40px;
      outline: none;
      border-radius: 10px;
      border: none;
      background-color: #052855;
      color: white;
      font-size: 14px;
      cursor: pointer;
      &:disabled {
        background-color: gray;
        cursor: not-allowed;
      }
    }
  }
`;
