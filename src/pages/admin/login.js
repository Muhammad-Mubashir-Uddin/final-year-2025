import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styled from "styled-components";
import backimg from "../../../public/assests/Admin Login.png";
import Image from "next/image";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await axios.post("/api/admin/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", response.data.token);
      router.push("/admin/dashboard");
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Failed to login", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminLoginStyled>
      <div className="sectionA">
        <Image src={backimg} alt="Admin Login Background" />
      </div>
      <div className="sectionB">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Login"}
          </button>
        </form>
      </div>
    </AdminLoginStyled>
  );
};

export default AdminLogin;

const AdminLoginStyled = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f8fa;
  font-family: "Poppins", sans-serif;

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
    justify-content: center;
    align-items: center;

    h1 {
      color: #052855;
    }

    form {
      display: flex;
      flex-direction: column;
      width: 50%;
      margin-top: 20px;

      label {
        margin-bottom: 5px;
        color: #052855;
        font-size: 14px;
      }

      input {
        margin-bottom: 15px;
        height: 40px;
        padding-left: 10px;
        border: 1px solid #ddd;
        outline: none;
        border-radius: 10px;
      }

      button {
        height: 40px;
        border: none;
        border-radius: 10px;
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
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .sectionA,
    .sectionB {
      width: 100%;
    }

    .sectionB form {
      width: 80%;
    }
  }
`;
