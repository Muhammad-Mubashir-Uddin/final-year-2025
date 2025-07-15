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
  .form-group {
    display: flex;
    flex-direction: column;

    margin-bottom: 15px;
    label {
      margin-bottom: 5px;
      font-weight: bold;
    }
    input {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 16px;
      width: 100%;
      box-sizing: border-box;

      &:focus {
        border-color: #052855;
        outline: none;
      }
    }
  }
  button {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: none;
    background-color: #052855;
    color: white;
    font-weight: bold;
    cursor: pointer;

    &:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
  }
`;
// This component allows users to edit their profile information.
// It fetches the current user data, allows changes, and submits updates to the server.
