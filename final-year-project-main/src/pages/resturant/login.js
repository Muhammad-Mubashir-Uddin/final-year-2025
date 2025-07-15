import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Image from "next/image";
import backimg from "../../../public/assests/Portal Tech Co..png";
import Link from "next/link";
import { useRouter } from "next/router";

// Function to decode JWT and get expiry time
const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return payload.exp ? payload.exp * 1000 : null; // Convert seconds to milliseconds
  } catch (error) {
    return null;
  }
};

const LoginRestaurant = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Check if the token is expired and remove it
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const expiryTime = getTokenExpiry(token);
      if (!expiryTime || Date.now() > expiryTime) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await axios.post("/api/resturant/login", formData);

      const token = response.data.token;
      const expiryTime = getTokenExpiry(token); // Extract expiry from JWT

      if (!expiryTime) {
        throw new Error("Invalid token received");
      }

      localStorage.setItem("token", token);

      router.push("/resturant/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  // Remove token when the tab is closed
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("token");
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return (
    <LoginStyled>
      <div className="sectionA">
        <Image src={backimg} alt="Background Image" />
      </div>
      <div className="sectionB">
        <h1>Restaurant Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Login"}
          </button>
        </form>

        <p className="tagline">
          Don't have an account?{" "}
          <Link href="/resturant/register">Register</Link>
        </p>
      </div>
    </LoginStyled>
  );
};

export default LoginRestaurant;

const LoginStyled = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f8fa;
  font-family: poppins;
  .sectionA {
    width: 50%;
    img {
      width: 100%;
      height: auto;
    }
  }
  .sectionB {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100vh;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    h1 {
      color: #052855;
    }
    form {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      width: 50%;
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
    .tagline {
      margin-top: 20px;
      a {
        text-decoration: underline;
      }
    }
  }
`;
