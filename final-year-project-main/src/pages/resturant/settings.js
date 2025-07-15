import ChangePassword from "@/components/ChangePasswordResturant";
import RestaurantLayout from "@/components/RestaurantLayout";
import SetTimings from "@/components/SetTimings";
import React from "react";
import styled from "styled-components";

export default function settings() {
  return (
    <RestaurantLayout>
      <SettingsStyled>
        <div className="container">
          <SetTimings />
          <ChangePassword />
        </div>
      </SettingsStyled>
    </RestaurantLayout>
  );
}

const SettingsStyled = styled.div`
  .container {
    background: #fff;
    border-radius: 15px;
    padding: 20px;
    margin-top: 10px;
    width: 100%;
    /* height: 100vh; */
  }
`;
