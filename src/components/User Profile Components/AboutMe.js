import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useRouter } from "next/router";

const AboutMe = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/users/login");
        return;
      }
      try {
        const res = await axios.get("/api/user/aboutme", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.user);
      } catch (error) {
        console.error(error);
        router.push("/users/login");
      }
    };
    fetchUserData();
  }, []);

  if (!userData) return <p>Loading...</p>;

  // Get initials for avatar
  const initials = (userData.firstName?.[0] || "U") + (userData.lastName?.[0] || "");

  return (
    <AboutCard>
      <Avatar>{initials.toUpperCase()}</Avatar>
      <h2>{userData.firstName} {userData.lastName}</h2>
      <InfoList>
        <InfoItem><strong>Email:</strong> {userData.email}</InfoItem>
        <InfoItem><strong>Phone:</strong> {userData.phoneNo}</InfoItem>
        <InfoItem><strong>Address:</strong> {userData.address}</InfoItem>
        <InfoItem><strong>Total Orders:</strong> {userData.orderHistory?.length || 0}</InfoItem>
      </InfoList>
    </AboutCard>
  );
};

export default AboutMe;

const AboutCard = styled.div`
  background: #fff;
  border-radius: 16px;
  // box-shadow: 0 2px 12px rgba(5,40,85,0.10);
  padding: 28px 16px 18px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 220px;
  max-width: 90%;
  margin: 0 auto;
  font-family: poppins;
  h2 {
    color: #052855;
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 10px 0;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #052855;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #fff;
  font-weight: 700;
  margin-bottom: 8px;
  font-family: poppins;
`;

const InfoList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoItem = styled.div`
  font-size: 1rem;
  color: #052855;
  background: #f5f8fa;
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: 0 1px 4px rgba(5,40,85,0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: poppins;
`;
