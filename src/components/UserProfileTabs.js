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
  width: 100%;
 
  margin: 0 auto;

  .tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 0;
    margin-bottom: 24px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(5,40,85,0.06);
    padding: 6px 4px;

    .tab {
      cursor: pointer;
      padding: 10px 15px;
      border-radius: 12px;
      background: transparent;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      font-family: poppins;
      p {
        margin: 0;
        font-size: 1.05rem;
        color: #052855;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
      &:hover {
        background: #f5f8fa;
      }
      &.active {
        background: #052855;
        box-shadow: 0 2px 8px rgba(5,40,85,0.10);
        p {
          color: #fff;
          font-weight: 700;
        }
      }
    }
  }

  .line {
    display: none;
  }

  .content-wrapper {
    margin-top: 0;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    .content {
      display: none;
      width: 100%;
      height: 100%;
    }
    .content.visible {
      display: block;
      animation: fadeIn 0.3s;
    }
    .content.hidden {
      display: none;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 600px) {
    max-width: 99vw;
    .tabs {
      gap: 2px;
      .tab {
        padding: 8px 8px;
        font-size: 0.95rem;
      }
    }
    .content-wrapper {
      min-height: 220px;
    }
  }
`;
