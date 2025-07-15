import Image from "next/image";
import React from "react";
import styled from "styled-components";
import heroimage from "../../public/assests/hero section image.png";
import Link from "next/link";

const HeroSection = () => {
  return (
    <HeroSectionStyled>
      <div className="sectionA">
        <h1>Craving Something? Hunt Now!</h1>
        <p>
          Want to pickup,dineIn,delivered or reservation in any restaurant?
          Start Now
        </p>
        <div className="buttons">
          <button className="bA">
            <Link href="/users/register">Join platform Now</Link>
          </button>
          <button className="bB">
            <Link href="/users/login">Login Now</Link>
          </button>
        </div>
      </div>
      <div className="sectionB">
        <div className="white-back"></div>
        <Image src={heroimage} alt="" />
      </div>
    </HeroSectionStyled>
  );
};

export default HeroSection;

const HeroSectionStyled = styled.div`
  display: flex;
  padding-top: 10%;
  /* height: 100vh; */
  /* overflow: hidden; */
  justify-content: space-between;
  align-items: center;
  font-family: poppins;
  /* padding-bottom: 100px; */
  .sectionA {
    width: 40%;
    margin-left: 5%;
    h1 {
      font-size: 50px;
      line-height: 50px;
      color: #052855;
      margin-bottom: 10px;
    }
    p {
      font-size: 18px;
      color: gray;
      margin-bottom: 20px;
    }
    .buttons {
      .bA {
        padding: 10px 25px;
        font-size: 14px;
        outline: none;
        background-color: transparent;
        border: 1px solid #052855;
        border-radius: 20px;
        margin-right: 20px;
        color: #052855;
      }
      .bB {
        padding: 10px 30px;
        font-size: 14px;
        outline: none;
        background-color: #052855;
        border: none;
        border-radius: 20px;
        color: white;
        box-shadow: 0px 4px 10px rgba(0, 0, 255, 0.2);
      }
    }
  }
  .sectionB {
    /* display: flex; */
    justify-content: center;
    align-items: center;
    .white-back {
      width: 1100px;
      height: 800px;
      background-color: white;
      border-radius: 200px;
      transform: rotate(-50deg);
      margin-top: -30%;
      margin-left: 5%;
      /* box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.); */
    }
    width: 60%;
    img {
      width: 70%;
      margin-top: -500px;
      height: auto;
      position: relative;
      margin-left: 22%;
    }
  }
`;
