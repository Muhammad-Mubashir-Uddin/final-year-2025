import React from "react";
import styled from "styled-components";

const SummaryCard = (props) => {
  return (
    <SummaryCardStyled>
      <div className="card">
        <div className="icon">{props.icon} </div>
        <div className="data">
          <p>{props.name}</p>
          <h2>{props.numbers}</h2>
        </div>
      </div>
    </SummaryCardStyled>
  );
};

export default SummaryCard;

const SummaryCardStyled = styled.div`
  width: 100%;
  margin: 0px 10px;
  .card {
    background-color: white;
    border-radius: 15px;
    height: 70px;
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 10px;
    /* width: 100%; */
  }
  .icon {
    background-color: #052855;
    height: 55px;
    width: 55px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    svg {
      width: 30px;
      height: auto;
    }
  }
  .data {
    margin-left: 10px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    /* padding-top: 10px; */
    p {
      font-size: 12px;
      color: #052855;
    }
    h2 {
      font-weight: 600;
      margin: 0;
      /* margin-top: -5px; */
      color: #052855;
    }
  }
`;
