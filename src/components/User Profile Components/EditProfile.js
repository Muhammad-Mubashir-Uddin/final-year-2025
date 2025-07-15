// components/EditProfile.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/router";
import { set } from "mongoose";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    address: "",
    email: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return router.push("/users/login");

    axios
      .get("/api/user/aboutme", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const { firstName, lastName, phoneNo, address, email } = res.data.user;
        const userData = { firstName, lastName, phoneNo, address, email };
        setFormData(userData);
        setOriginalData(userData);
        setLoading(false);
      })
      .catch(() => router.push("/users/login"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    const hasChanged = Object.keys(updatedData).some(
      (key) => updatedData[key] !== originalData?.[key]
    );

    setIsChanged(hasChanged);
  };

  const handleSubmit = async (e) => {
    setUpdating(true);
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const res = await axios.put("/api/user/editprofile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile updated successfully!");
      setOriginalData(res.data.user);
      setIsChanged(false);
    } catch (err) {
      alert("Something went wrong while updating profile!");
    }
    setUpdating(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <EditProfileStyled>
      <form onSubmit={handleSubmit}>
        {["firstName", "lastName", "email", "phoneNo", "address"].map(
          (field) => (
            <div className="form-group" key={field}>
              <label>{field.replace(/([A-Z])/g, " $1")}</label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          )
        )}
        <button type="submit" disabled={!isChanged}>
          {updating === true ? "Saving...." : "Save Changes"}
        </button>
      </form>
    </EditProfileStyled>
  );
};

export default EditProfile;

const EditProfileStyled = styled.div`
  background: #fff;
  border-radius: 16px;
  // box-shadow: 0 2px 12px rgba(5,40,85,0.10);
  padding: 28px 16px 18px 16px;
  // max-width: 400px;
  margin: 0 auto;
  font-family: poppins;
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    label {
      margin-bottom: 5px;
      font-weight: 500;
      color: #052855;
      font-family: poppins;
    }
    input {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 1rem;
      width: 100%;
      box-sizing: border-box;
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
    border-radius: 8px;
    border: none;
    background: #052855;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s;
    font-family: poppins;
    &:disabled {
      background: #aaa;
      cursor: not-allowed;
    }
    &:hover:not(:disabled) {
      background: #034074;
    }
  }
`;
// This component allows users to edit their profile information.
// It fetches the current user data, allows changes, and submits updates to the server.
