import React, { useState } from "react";
import styled from "styled-components";
import AboutMe from "@/components/User Profile Components/AboutMe";
import EditProfile from "@/components/User Profile Components/EditProfile";
import PasswordReset from "@/components/User Profile Components/PasswordReset";
import MyOrders from "@/components/User Profile Components/MyOrders";

const tabs = ["About Me", "Edit Profile", "Password Reset", "My Orders"];

const UserProfileTabs = () => {
  const [index, setIndex] = useState(0);

  return (
    <UserProfileTabsStyled>
      <div className="tabs">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={`tab ${index === i ? "active" : ""}`}
            onClick={() => setIndex(i)}
          >
            <p>{tab}</p>
          </div>
        ))}
      </div>

      <div className="line">
        <div className="active-line" style={{ left: `${index * 25}%` }} />
      </div>

      <div className="content-wrapper">
        <div className={`content ${index === 0 ? "visible" : "hidden"}`}>
          <AboutMe />
        </div>
        <div className={`content ${index === 1 ? "visible" : "hidden"}`}>
          <EditProfile />
        </div>
        <div className={`content ${index === 2 ? "visible" : "hidden"}`}>
          <PasswordReset />
        </div>
        <div className={`content ${index === 3 ? "visible" : "hidden"}`}>
          <MyOrders />
        </div>
      </div>
    </UserProfileTabsStyled>
  );
};

export default UserProfileTabs;

const UserProfileTabsStyled = styled.div`
  width: 90%;

  .tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    margin-top: 40px;

    .tab {
      cursor: pointer;
      p {
        margin: 0;
        font-size: 16px;
        color: #333;
      }

      &.active p {
        color: #052855;
        font-weight: bold;
      }
    }
  }

  .line {
    position: relative;
    background-color: #ddd;
    height: 1px;
    width: 70%;
    margin: 20px auto 0 auto;
    overflow: hidden;

    .active-line {
      position: absolute;
      top: 0;
      height: 2px;
      width: 25%; /* 4 tabs = 25% each */
      background-color: #052855;
      transition: left 0.3s ease;
    }
  }

  .content-wrapper {
    margin-top: 30px;
    height: 300px; /* adjust to your needs */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .content {
      display: none;
      width: 100%;
      height: 100%;
    }

    .content.visible {
      display: block;
    }

    .content.hidden {
      display: none;
    }
  }
`;
