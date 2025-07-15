import Image from "next/image";
import React from "react";
import styled from "styled-components";
import huston from "../../public/assests/cities/huston.jpeg";
import Newyork from "../../public/assests/cities/new york.jpg";
import LosAngeles from "../../public/assests/cities/los angeles.jpg";
import SanAntonio from "../../public/assests/cities/san aontanio.jpeg";
import Chicago from "../../public/assests/cities/chicago.jpg";
import Philadephia from "../../public/assests/cities/philadephia.jpeg";

const SectionThree = () => {
  const cities = [
    { id: 1, name: "Huston", img: huston },
    { id: 2, name: "New York", img: Newyork },
    { id: 3, name: "Los Angeles", img: LosAngeles },
    { id: 4, name: "San Antonio", img: SanAntonio },
    { id: 5, name: "Chicago", img: Chicago },
    { id: 6, name: "Philadelphia", img: Philadephia },
  ];

  return (
    <SectionThreeStyled>
      <h1>Find us in these cities and many more!</h1>
      <div className="cards">
        {cities.map((city) => {
          return (
            <div className="card" key={city.id}>
              <div className="card-img">
                <Image src={city.img} alt="" />
              </div>
              <div className="card-content">
                <button>{city.name}</button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionThreeStyled>
  );
};

export default SectionThree;

const SectionThreeStyled = styled.div`
  width: 90%;
  margin-right: 5%;
  margin-left: 5%;
  font-family: poppins;
  height: 100vh;
  h1 {
    color: #052855;
  }
  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-row-gap: 20px;
    grid-column-gap: 20px;
    justify-content: center;
    align-items: center;
    margin-top: 2%;
    padding-bottom: 2%;
    .card {
      /* width: 330px; */
      height: 250px;
      border-radius: 20px;
      background-color: white;
      overflow: hidden;
      .card-img {
        img {
          object-fit: cover;
          width: 100%;
          height: 250px;
          /* object-fit: 100px; */
        }
      }
      .card-content {
        /* background-color: white; */
        color: #052855;
        position: relative;
        margin-top: -40px;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
        /* padding: 5px 20px; */
        /* border-radius: 20px; */
        /* font-weight: 600; */
        button {
          padding: 5px 20px;
          border-radius: 20px;
          outline: none;
          border: none;
          color: #052855;
          font-weight: 600;
          background-color: white;
        }
      }
    }
  }
`;
