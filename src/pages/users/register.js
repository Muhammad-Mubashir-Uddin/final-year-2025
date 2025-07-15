import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validation logic for enabling "Next" button
    const allFieldsFilled =
      currentStep === 1
        ? formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phoneNo
        : formData.address && formData.password && formData.confirmPassword;
    const passwordsMatch =
      name !== "password" || formData.confirmPassword === value;
    const confirmPasswordsMatch =
      name !== "confirmPassword" || formData.password === value;
    const passwordValid =
      name !== "password" && name !== "confirmPassword"
        ? true
        : value.length >= 6;

    setIsNextEnabled(
      allFieldsFilled &&
        passwordsMatch &&
        confirmPasswordsMatch &&
        passwordValid
    );
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitDisabled(true);

    try {
      const response = await axios.post("/api/user/register", formData);
      alert(response.data.message);
      router.push("/users/login"); // Redirect to login page
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitDisabled(false);
    }
  };

  return (
    <RegisterStyled>
      <div className="form-container">
        <div className="back-button" onClick={() => router.back()}>
          ← Back
        </div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="step">
            <div className="double">
              <div className="d">
                <label>First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="double">
              <div className="d">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d">
                <label>Phone</label>
                <input
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  pattern="[0-9]{11}"
                  required
                />
              </div>
            </div>
            
          </div>
          <div className="step">
            <div className="d">
              <label>Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="double">
              <div className="d">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {formData.password && formData.password.length < 6 && (
                  <p className="error">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>
              <div className="d">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isSubmitDisabled}>
              {isSubmitDisabled ? "Registering..." : "Submit"}
            </button>
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Already have an account?
              <Link href="/users/login"> Login Here</Link>
            </p>
          </div>
        </form>
      </div>
    </RegisterStyled>
  );
}

const RegisterStyled = styled.div`
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
    width: 50%;
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

    .step {
      h2 {
        color: #052855;
        margin-bottom: 20px;
      }

      .double {
        display: flex;
        gap: 20px;

        .d {
          flex: 1;
        }
      }

      .d {
        margin-bottom: 15px;

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

        .error {
          color: red;
          font-size: 12px;
        }
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
  }
`;
