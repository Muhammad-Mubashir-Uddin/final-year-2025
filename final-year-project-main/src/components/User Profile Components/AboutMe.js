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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  return (
    <AboutContainer>
      <h2>About Me</h2>
      <InfoBox>
        <strong>First Name:</strong> {userData.firstName}
      </InfoBox>
      <InfoBox>
        <strong>Last Name:</strong> {userData.lastName}
      </InfoBox>
      <InfoBox>
        <strong>Email:</strong> {userData.email}
      </InfoBox>
      <InfoBox>
        <strong>Phone:</strong> {userData.phoneNo}
      </InfoBox>
      <InfoBox>
        <strong>Address:</strong> {userData.address}
      </InfoBox>
      <InfoBox>
        <strong>Total Orders:</strong> {userData.orderHistory?.length || 0}
      </InfoBox>
    </AboutContainer>
  );
};

export default AboutMe;

const AboutContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  /* background-color: #f5f8fa; */
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: poppins;
  backdrop-filter: blur(10px);

  h2 {
    color: #052855;
    margin-bottom: 30px;
    text-align: center;
  }
`;

const InfoBox = styled.p`
  margin: 10px 0;
  font-size: 16px;
  color: #333;
`;
