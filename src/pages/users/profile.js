import NavigationBar from "@/components/NavigationBar";
import UserProfileTabs from "@/components/UserProfileTabs";
import React from "react";
import styled from "styled-components";

export default function profile() {
  return (
 <div>

 <div>
    <NavigationBar />
    </div>
 
    <ProfileWrapper>
     
      <ProfileHeader>
        
        <h1>My Profile</h1>
      </ProfileHeader>
      <ProfileCard>
        <UserProfileTabs />
      </ProfileCard>
    </ProfileWrapper>
    
     </div>
  );
}

const ProfileWrapper = styled.div`
  background: #f5f8fa;
  min-height: 100vh;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 18px;
  margin-top: 24px;
  gap: 10px;

  h1 {
    color: #052855;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: 1px;
    font-family: poppins;
  }
`;

const Avatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #052855;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(5, 40, 85, 0.15);
  font-family: poppins;
`;

const ProfileCard = styled.div`
  width: 40%;
  // max-width: 100px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(5, 40, 85, 0.10);
  padding: 32px 20px 24px 20px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (max-width: 700px) {
    padding: 18px 6px 12px 6px;
    max-width: 98vw;
  }
`;
