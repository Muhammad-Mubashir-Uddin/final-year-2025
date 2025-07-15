import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/router"; // Import useRouter for navigation

const AddAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login"); // Redirect to login page if no token
      return;
    }

    try {
      const res = await axios.post(
        "/api/admin/register",
        { email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in header
          },
        }
      );
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <AddAdminStyled>
      <h1>Add Admin</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </AddAdminStyled>
  );
};

export default AddAdmin;

// Added some basic styles for better UI
const AddAdminStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  width: 100%;
  height: 85vh;
  h1 {
    color: #052855;
  }
  form {
    background: #fff;
    padding: 20px;
    width: 100%;
    border-radius: 8px;
    /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); */
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 300px;
  }
  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    
  }
  button {
    background: #052855;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background: #005bb5;
  }
`;
