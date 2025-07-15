import React, { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

const HeroSectionHomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/users/login"); // Redirect to login if no token
    }
  }, []);
  return (
    <HeroSectionStyled>
      <h1>Craving Something? Hunt Now!</h1>
      <p>
        Want to pickup,dineIn,delivered or reservation in any restaurant? Search
        Food Now
      </p>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for restaurants, cuisines, or dishes"
        />
        <button>Search</button>
      </div>
      {/* <p>Dishes | Platform Suggested restaurants | Most Selling Dishes | top rated dishes and restaurants</p> */}
    </HeroSectionStyled>
  );
};

export default HeroSectionHomePage;

const HeroSectionStyled = styled.div`
  height: 70vh;
  background-color: #f5f8fa;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 50px;
    line-height: 50px;
    color: #052855;
    margin-bottom: 15px;
  }
  .search-box {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    input {
      width: 80%;
      padding: 10px;
      padding-left: 20px;
      border-radius: 20px;
      border: none;
      outline: none;
      margin-right: 10px;
    }
    button {
      padding: 10px 20px;
      background-color: #052855;
      color: white;
      border-radius: 20px;
      border: none;
      cursor: pointer;
    }
  }
`;
