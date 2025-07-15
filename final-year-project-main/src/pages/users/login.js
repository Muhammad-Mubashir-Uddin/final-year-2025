import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import NavigationBar from "@/components/NavigationBar";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage(""); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.post("/api/user/login", formData);

      const token = response.data.token;
      localStorage.setItem("userToken", token);

      alert(response.data.message);
      router.push("/users/home"); // Redirect to the dashboard or home page
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NavigationBar />
      <LoginStyled>
        <div className="form-container">
          <div className="back-button" onClick={() => router.back()}>
            ← Back
          </div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Don't have an account?
            <Link href="/users/register"> Register Here</Link>
          </p>
        </div>
      </LoginStyled>
    </div>
  );
}

const LoginStyled = styled.div`
  background-color: #f5f8fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: poppins;
  a {
    text-decoration: underline;
  }
  .form-container {
    background: white;
    width: 30%;
    border-radius: 20px;
    padding: 40px;
    position: relative;

    h1 {
      text-align: center;
      color: #052855;
      margin-bottom: 20px;
    }

    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
      cursor: pointer;
      color: #052855;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        margin-bottom: 5px;
        color: gray;
        font-size: 12px;
      }

      input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        outline: none;
      }
    }

    .error {
      color: red;
      font-size: 12px;
      margin-bottom: 15px;
    }

    button {
      width: 100%;
      padding: 10px;
      background-color: #052855;
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;

      &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
      }
    }
  }
`;
