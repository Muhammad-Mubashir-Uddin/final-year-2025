import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/router";

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setUpdating(true);
    e.preventDefault();
    const token = localStorage.getItem("userToken");

    if (formData.newPassword !== formData.confirmPassword) {
      return alert("New password and confirm password do not match.");
    }

    try {
      await axios.put(
        "/api/user/resetpassword",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password updated successfully!");
      router.push("/users/home");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update password.");
    }
    setUpdating(false);
  };

  return (
    <ResetPasswordStyled>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.replace(/([A-Z])/g, " $1")}</label>
            <input
              type="password"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">
          {updating === true ? "Updating..." : "Change Password"}
        </button>
      </form>
    </ResetPasswordStyled>
  );
};

export default PasswordReset;

const ResetPasswordStyled = styled.div`
  background: #fff;
  border-radius: 16px;
  // box-shadow: 0 2px 12px rgba(5,40,85,0.10);
  padding: 28px 16px 18px 16px;
  // max-width: 400px;
  margin: 0 auto;
  font-family: poppins;
  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #052855;
    font-size: 1.3rem;
    font-weight: 700;
    font-family: poppins;
  }
  .form-group {
    margin-bottom: 16px;
    label {
      display: block;
      margin-bottom: 5px;
      color: #052855;
      font-weight: 500;
      font-family: poppins;
    }
    input {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 1rem;
      font-family: poppins;
      &:focus {
        border-color: #2196f3;
        outline: none;
      }
    }
  }
  button {
    width: 100%;
    padding: 12px;
    background: #052855;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s;
    font-family: poppins;
    &:hover {
      background: #034074;
    }
  }
`;
