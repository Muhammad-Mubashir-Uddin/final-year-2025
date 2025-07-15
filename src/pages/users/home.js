import HeroSectionHomePage from "@/components/HeroSectionHomePage";
import NavigationBar from "@/components/NavigationBar";
import TopRestaurants from "@/components/TopRestaurants";
import TopProducts from "@/components/TopProducts";
import React from "react";
import styled from "styled-components";
import dynamic from 'next/dynamic';
const ChatbotWidget = dynamic(() => import('../../components/chatbot/ChatbotWidget'), { ssr: false });

export default function Home() {
  return (
    <>
      <NavigationBar />
      <HomePageStyled>
        <div className="main-content">
          <HeroSectionHomePage />
          <TopRestaurants />
          <TopProducts />
        </div>
      </HomePageStyled>
      <ChatbotWidget />
    </>
  );
}

const HomePageStyled = styled.div`
  
`;
