import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useRouter } from "next/router";

const slideDown = keyframes`
  from { max-height: 0; opacity: 0; }
  to { max-height: 800px; opacity: 1; }
`;
const slideUp = keyframes`
  from { max-height: 800px; opacity: 1; }
  to { max-height: 0; opacity: 0; }
`;

const SetTimings = () => {
  const [mealTypes, setMealTypes] = useState([]);
  const [timings, setTimings] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/resturant/login");
      return;
    }

    const fetchMealTypes = async () => {
      try {
        const response = await axios.get("/api/resturant/timings", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("API Response:", response.data);

        if (response.data.mealTimingsByType) {
          setMealTypes(Object.keys(response.data.mealTimingsByType));

          // Transform API response from array to object format
          const formattedTimings = {};
          Object.keys(response.data.mealTimingsByType).forEach((mealType) => {
            formattedTimings[mealType] = {};

            response.data.mealTimingsByType[mealType].forEach((entry) => {
              formattedTimings[mealType][entry.day] = {
                open: entry.startTime,
                close: entry.endTime,
              };
            });
          });

          setTimings(formattedTimings);
        } else {
          console.error("mealTimingsByType not found in response");
        }
      } catch (error) {
        console.error("Error fetching meal types:", error);
        if (error.response?.status === 401) {
          alert("Session expired! Please log in again.");
          router.replace("/resturant/login");
        }
      }
    };

    fetchMealTypes();
  }, []);

  const handleTimingChange = (meal, day, type, value) => {
    setTimings((prev) => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [day]: {
          ...prev[meal]?.[day],
          [type]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const saveTimings = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/resturant/login");
      return;
    }

    const formattedTimings = [];

    Object.keys(timings).forEach((mealType) => {
      Object.keys(timings[mealType]).forEach((day) => {
        const { open, close } = timings[mealType][day] || {};

        if (open && close) {
          formattedTimings.push({
            mealType,
            day,
            startTime: open,
            endTime: close,
          });
        }
      });
    });

    try {
      const response = await axios.post(
        "/api/resturant/timings",
        { timings: formattedTimings },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      alert("Timings saved successfully!");
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      alert("Failed to save timings. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SetTimingsStyled>
      <div className="heading">
        <h2>Timings</h2>
        <button onClick={saveTimings} disabled={!hasChanges || isSaving}>
          {isSaving ? "Saving..." : "Save Timings"}
        </button>
      </div>
      <div className="section">
        {mealTypes.map((meal, idx) => (
          <div key={meal} className="meal-container">
            <div
              className="title"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <h3>{meal}</h3>
              <div className={`arrow-down ${openIndex === idx ? "open" : ""}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#052855"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#ffffff"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
            <div
              className={`dropdown ${openIndex === idx ? "open" : "closed"}`}
            >
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div key={day} className="day">
                  <p>{day}</p>
                  <div className="timings">
                    <div className="open">
                      <label>Open:</label>
                      <input
                        type="time"
                        value={timings[meal]?.[day]?.open || ""}
                        onChange={(e) =>
                          handleTimingChange(meal, day, "open", e.target.value)
                        }
                      />
                    </div>
                    <div className="close">
                      <label>Close:</label>
                      <input
                        type="time"
                        value={timings[meal]?.[day]?.close || ""}
                        onChange={(e) =>
                          handleTimingChange(meal, day, "close", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SetTimingsStyled>
  );
};

export default SetTimings;

const SetTimingsStyled = styled.div`
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      padding: 7px 25px;
      border-radius: 10px;
      background-color: #052855;
      color: white;
      border: none;
      outline: none;
      cursor: pointer;
      &:disabled {
        background-color: #aaa;
        cursor: not-allowed;
      }
    }
    h2 {
      padding-left: 10px;
      color: #052855;
    }
  }
  .meal-container {
    /* border: 1px solid #052855; */
    padding: 10px 15px;
    border-radius: 15px;
    /* box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.05); */
    box-shadow: 0px 4px 10px rgba(0, 0, 255, 0.2);
    margin-bottom: 20px;
    /* padding-bottom: 30px; */
  }
  .section {
    margin-top: 30px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    h3 {
      color: #052855;
    }
    svg {
      height: 45px;
      padding: 10px;
      border-radius: 10px;
      transition: transform 0.3s ease;
    }
    .open svg {
      transform: rotate(90deg);
    }
  }
  .dropdown {
    overflow: hidden;
    transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
    padding-bottom: 20px;
  }
  .dropdown.open {
    animation: ${slideDown} 0.5s forwards;
  }
  .dropdown.closed {
    animation: ${slideUp} 0.5s forwards;
  }
  .day {
    width: 100%;
    margin-top: 10px;
    p {
      padding-bottom: 5px;
      color: #052855;
      margin-top: 20px;
    }
    label {
      color: #052855;
      padding-right: 10px;
    }
    .timings {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0px;
    }
    .open,
    .close {
      display: flex;
      align-items: center;
      width: 50%;
      input {
        width: 80%;
        height: 40px;
        border-radius: 10px;
        border: 1px solid #ddd;
        color: black;
        padding-left: 10px;
        padding-right: 10px;
        outline: none;
      }
    }
    select {
      width: 80%;
      height: 40px;
      border-radius: 10px;
      border: 1px solid #ddd;
      color: gray;
      padding-left: 10px;
      padding-right: 10px;
      outline: none;
    }
  }
`;
