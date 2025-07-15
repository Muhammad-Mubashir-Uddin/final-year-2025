import Image from "next/image";
import React from "react";
import styled from "styled-components";
import image from "../../public/assests/section2.jpeg";
import Link from "next/link";

const SectionTwo = () => {
  return (
    <SectionTwoStyled>
      <h1>You prepare the food, we handle the rest</h1>
      <Image src={image} alt=" " />
      <div className="box">
        <h2>List your restaurant or shop on food Hunt</h2>
        <p>
          Would you like millions of new customers to enjoy your amazing food
          and groceries? So would we!
        </p>
        <p>
          It's simple: we list your menu and product lists online, help you
          process orders, pick them up, and deliver them to hungry pandas – in a
          heartbeat!
        </p>
        <p>Interested? Let's start our partnership today!</p>
        <Link href="/resturant/register">
          <button>Get Started</button>
        </Link>
      </div>
    </SectionTwoStyled>
  );
};

export default SectionTwo;

const SectionTwoStyled = styled.div`
  margin-top: 15%;
  margin-left: 5%;
  margin-right: 5%;
  padding-bottom: 5%;
  font-family: poppins;
  width: 90%;
  height: 100vh;

  h1 {
    color: #052855;
  }
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    /* height: auto; */
    margin-top: 30px;
    border-radius: 20px;
  }
  .box {
    width: 700px;
    /* height: 300px; */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    background-color: white;
    border-radius: 30px;
    margin-top: -200px;
    margin-left: 30px;
    position: relative;
    padding: 20px 30px;
    h2 {
      color: #052855;
    }
    p {
      margin-top: 20px;
    }
    button {
      background-color: #052855;
      padding: 10px 25px;
      color: white;
      margin-top: 30px;
      outline: none;
      border: none;
      border-radius: 10px;
      box-shadow: 0px 4px 10px rgba(0, 0, 255, 0.2);
      cursor: pointer;
    }
  }
`;
