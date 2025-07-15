import NavigationBar from "@/components/NavigationBar";
import UserProfileTabs from "@/components/UserProfileTabs";
import React from "react";
import styled from "styled-components";

export default function profile() {
  return (
    <ProfileStyled>
      <NavigationBar />
      <div className="background">
        <h1>My Profile</h1>
      </div>
      <div className="container">
        <UserProfileTabs />
      </div>
    </ProfileStyled>
  );
}

const ProfileStyled = styled.div`
  background-color: #052855;
  /* width: 100%; */
  height: 130vh;
  .background {
    height: 70vh;
    background-color: #f5f8fa;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    h1 {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #052855;
      margin-top: 130px;
      font-size: 50px;
      font-weight: 700;
    }
  }
  .container {
    width: 70%;
    height: 80vh;
    background-color: white;
    margin-top: 40px;
    /* position: absolute; */
    /* top: 50%; */
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    margin-left: 50%;
    margin-right: 50%;
  }
`;
