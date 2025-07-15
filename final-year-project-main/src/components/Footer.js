import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterStyled>
      <div className="section">
        <h1>Food Hunt</h1>
        <p>
          © 2019 Food Hunt. All Rights Reserved. 
        </p>
      </div>
    </FooterStyled>
  );
};

export default Footer;

const FooterStyled = styled.div`
  background-color: #052855;
  color: white;
  .section {
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
    padding-top: 2%;
    margin-top: 2%;
    padding-bottom: 2%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
