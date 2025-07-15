import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

export default function RestaurantRegister() {
  const [currentStep, setCurrentStep] = useState(1); // Step tracking
  const [isNextEnabled, setIsNextEnabled] = useState(false); // Enable "Next" button
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // Disable "Submit" button during processing
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    cnic: "",
    password: "",
    confirmPassword: "",
  });

  const [restaurantInfo, setRestaurantInfo] = useState({
    restaurantName: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    mealType: "",
    facilities: [],
  });

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });

    // Check if all fields in "About You" are filled properly
    const allFieldsFilled = Object.values({
      ...userInfo,
      [name]: value,
    }).every((val) => val !== "");
    const passwordsMatch =
      name !== "password" || userInfo.confirmPassword === value;
    const confirmPasswordsMatch =
      name !== "confirmPassword" || userInfo.password === value;

    setIsNextEnabled(
      allFieldsFilled && passwordsMatch && confirmPasswordsMatch
    );
  };

  const handleRestaurantInfoChange = (e) => {
    const { name, value } = e.target;
    if (name === "facilities") {
      const selectedFacilities = restaurantInfo.facilities.includes(value)
        ? restaurantInfo.facilities.filter((facility) => facility !== value)
        : [...restaurantInfo.facilities, value];
      setRestaurantInfo({ ...restaurantInfo, facilities: selectedFacilities });
    } else {
      setRestaurantInfo({ ...restaurantInfo, [name]: value });
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitDisabled(true);
    try {
      const combinedData = { ...userInfo, ...restaurantInfo };
      await axios.post("/api/resturant/register", combinedData);
      alert("Registration successful!");
      window.location.href = "/resturant/login";
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong.");
      setIsSubmitDisabled(false);
    }
  };

  return (
    <RestaurantRegisterStyled>
      <div>
        <div className="title">
          <h1>Restaurant Registration</h1>
          <p>
            Want to increase your customer base, manage orders, and
            reservations? You are at the right place!
          </p>
        </div>
        <div className="section">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div>
                <h2>About You</h2>
                <div className="single">
                  <label>Name</label>
                  <input
                    name="name"
                    // placeholder="Name"
                    value={userInfo.name}
                    onChange={handleUserInfoChange}
                    required
                  />
                </div>
                <div className="double">
                  <div className="d">
                    <label>Email</label>
                    <input
                      name="email"
                      // placeholder="Email"
                      value={userInfo.email}
                      onChange={handleUserInfoChange}
                      required
                    />
                  </div>
                  <div className="d">
                    <label>Phone</label>
                    <input
                      name="phone"
                      // placeholder="Phone"
                      value={userInfo.phone}
                      onChange={handleUserInfoChange}
                      required
                    />
                  </div>
                </div>
                <div className="double">
                  <div className="d">
                    <label>Role</label>
                    <select
                      name="role"
                      value={userInfo.role}
                      onChange={handleUserInfoChange}
                      required
                    >
                      <option value="">Select Your Role</option>
                      <option value="manager">Manager</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                  <div className="d">
                    <label>CNIC</label>
                    <input
                      name="cnic"
                      // placeholder="CNIC"
                      value={userInfo.cnic}
                      onChange={handleUserInfoChange}
                      required
                    />
                  </div>
                </div>
                <div className="double">
                  <div className="d">
                    <label>Password</label>
                    <input
                      name="password"
                      type="password"
                      // placeholder="Password"
                      value={userInfo.password}
                      onChange={handleUserInfoChange}
                      required
                    />
                  </div>
                  <div className="d">
                    <label>Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      // placeholder="Confirm Password"
                      value={userInfo.confirmPassword}
                      onChange={handleUserInfoChange}
                      required
                    />
                  </div>
                </div>
                <div className="button">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isNextEnabled}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2>About Restaurant</h2>
                <div className="single">
                  <label>Restaurant Name</label>
                  <input
                    name="restaurantName"
                    // placeholder="Restaurant Name"
                    value={restaurantInfo.restaurantName}
                    onChange={handleRestaurantInfoChange}
                    required
                  />
                </div>
                <div className="single">
                  <label>Address</label>
                  <input
                    name="address"
                    // placeholder="Address"
                    value={restaurantInfo.address}
                    onChange={handleRestaurantInfoChange}
                    required
                  />
                </div>
                <div className="double">
                  <div className="d">
                    <label>City</label>
                    <input
                      name="city"
                      // placeholder="City"
                      value={restaurantInfo.city}
                      onChange={handleRestaurantInfoChange}
                      required
                    />
                  </div>
                  <div className="d">
                    <label>Country</label>
                    <input
                      name="country"
                      // placeholder="Country"
                      value={restaurantInfo.country}
                      onChange={handleRestaurantInfoChange}
                      required
                    />
                  </div>
                </div>
                <div className="double">
                  <div className="d">
                    <label>Zip Code</label>
                    <input
                      name="zipCode"
                      // placeholder="Zip Code"
                      value={restaurantInfo.zipCode}
                      onChange={handleRestaurantInfoChange}
                      required
                    />
                  </div>
                  <div className="d">
                    <label>Meal Types</label>
                    <input
                      name="mealType"
                      placeholder="Meal Types (e.g., Breakfast, Lunch, Dinner)"
                      value={restaurantInfo.mealType}
                      onChange={handleRestaurantInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="boxes">
                  <p>Facilities Available</p>
                  <div className="facilities">
                    <label>
                      <input
                        type="checkbox"
                        name="facilities"
                        value="dineIn"
                        onChange={handleRestaurantInfoChange}
                      />
                      Dine-In
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="facilities"
                        value="pickUp"
                        onChange={handleRestaurantInfoChange}
                      />
                      Pick-Up
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="facilities"
                        value="delivery"
                        onChange={handleRestaurantInfoChange}
                      />
                      Delivery
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="facilities"
                        value="reservations"
                        onChange={handleRestaurantInfoChange}
                      />
                      Reservations
                    </label>
                  </div>
                </div>
                <div className="button">
                  <button type="submit" disabled={isSubmitDisabled}>
                    {isSubmitDisabled ? "Processing..." : "Submit"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </RestaurantRegisterStyled>
  );
}

const RestaurantRegisterStyled = styled.div`
  background-color: #f5f8fa;
  height: 100vh;
  font-family: poppins;
  overflow: hidden;
  .title {
    padding-top: 50px;
    h1 {
      color: #052855;
      text-align: center;
      /* color: red; */
    }
    p {
      text-align: center;
      margin-top: 10px;
    }
  }
  .section {
    background-color: white;
    height: 100vh;
    width: 90%;
    margin: 2% 5%;
    border-radius: 40px;
    h2 {
      color: #052855;
      padding-top: 60px;
      padding-left: 60px;
      font-size: 30px;
    }
    .single {
      margin-left: 60px;
      margin-top: 20px;
      width: 90%;
      display: flex;
      flex-direction: column;
      label {
        font-size: 14px;
        padding-left: 5px;
        color: rgb(174, 172, 172);
      }
      input {
        width: 100%;
        height: 40px;
        border: 1px solid #ddd;
        outline: none;
        padding-left: 10px;
        border-radius: 10px;
      }
    }
    .double {
      margin-left: 60px;
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 92%;
      .d {
        display: flex;
        flex-direction: column;
        width: 100%;
        label {
          margin-bottom: 4px;
          padding-left: 5px;
          font-size: 14px;
          color: rgb(174, 172, 172);
        }
      }
      input {
        width: 100%;
        height: 40px;
        border: 1px solid #ddd;
        outline: none;
        padding-left: 10px;
        border-radius: 10px;
        width: 96%;
      }
      select {
        width: 96%;
        height: 40px;
        border-radius: 10px;
        border: 1px solid #ddd;
        color: gray;
        padding-left: 10px;
        padding-right: 10px;
        outline: none;
      }
    }
    .button {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
      margin-right: 5.5%;
      button {
        width: 10%;
        height: 40px;
        border-radius: 10px;
        background-color: #052855;
        color: white;
        font-size: 15px;
        cursor: pointer;
      }
    }
  }
  .boxes {
    margin-left: 60px;
    margin-top: 15px;
    flex-direction: column;
    .facilities {
      /* margin-left: 60px; */
      /* margin-top: px; */
      display: flex; /* Display checkboxes in a row */
      flex-wrap: wrap; /* Allow wrapping to next row if necessary */
      gap: 30px; /* Adds spacing between each checkbox and label pair */
      label {
        /* text-align: left;
      margin-right: 30px;
      font-size: 18px;
      flex-direction: row;
      padding-right: 30px;
      gap: 10px; */
        display: flex;
        align-items: center;
        /* margin-left: 60px; */
        /* margin-top: 10px; */
        gap: 5px; /* Adds gap between checkbox and label text */
      }
    }
    p {
      font-size: 14px;
      color: rgb(174, 172, 172);
    }
  }
`;
