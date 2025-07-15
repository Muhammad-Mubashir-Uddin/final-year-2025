import NewOrders from "@/components/NewOrders";
import RestaurantLayout from "@/components/RestaurantLayout";
import React from "react";
import styled from "styled-components";

export default function newOrders() {
  return (
    <RestaurantLayout>
      <NewOrdersStyled>
        <NewOrders />
      </NewOrdersStyled>
    </RestaurantLayout>
  );
}

const NewOrdersStyled = styled.div``;
