import React from "react";
import styled from "styled-components";

const SectionFour = () => {
  return (
    <SectionFourStyled>
      <h1>
        Order food online from the best restaurants and shops on food Hunt
      </h1>
      <p>
        Are you hungry? Did you have a long and stressful day? Interested in
        getting a cheesy pizza delivered to your office or looking todo advance
        reservation or pickup? Then Food Hunt USA is the right destination for
        you!
        <br />
        Food Hunt offers you a long and detailed list of the best restaurants
        near you to help make your every day easier.
      </p>
      <h1>What's new?</h1>
      <p>
        ✓ Wide variety of restaurants and shops, an abundance of cuisines &
        products.
        <br /> ✓ High quality delivery service. <br />✓ Ai chat feature to give
        App users instant help when they need it. <br />✓ NEW: Dine In , Pick Up
        , Delivery and Reservation in any Restaurant under one roof
      </p>
    </SectionFourStyled>
  );
};

export default SectionFour;

const SectionFourStyled = styled.div`
  font-family: poppins;
  width: 90%;
  margin-left: 5%;
  margin-top: 2%;
  padding-bottom: 2%;
  height: 100vh;
  h1 {
    color: #052855;
  }
  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;
