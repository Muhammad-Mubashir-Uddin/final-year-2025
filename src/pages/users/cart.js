import React from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import NavigationBar from "@/components/NavigationBar";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const router = useRouter();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <NavigationBar />
      <CartBg>
        <CartCard>
          <CartTitle>Your Cart</CartTitle>
          {cartItems.length === 0 ? (
            <EmptyText>No items in cart.</EmptyText>
          ) : (
            <>
              <Items>
                {cartItems.map((item) => (
                  <CartItem key={item.menuItemId}>
                    <ItemDetails>
                      <RestaurantName>From: {item.restaurantName}</RestaurantName>
                      <ItemName>{item.name}</ItemName>
                      <QuantityControls>
                        <QtyButton
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </QtyButton>
                        <QtyDisplay>{item.quantity}</QtyDisplay>
                        <QtyButton
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        >
                          +
                        </QtyButton>
                      </QuantityControls>
                    </ItemDetails>
                    <ItemRight>
                      <ItemPrice>Rs. {item.price * item.quantity}</ItemPrice>
                      <RemoveButton onClick={() => removeFromCart(item.menuItemId)}>
                        Remove
                      </RemoveButton>
                    </ItemRight>
                  </CartItem>
                ))}
              </Items>
              <Divider />
              <TotalRow>
                <TotalLabel>Total</TotalLabel>
                <TotalValue>Rs. {total.toFixed(2)}</TotalValue>
              </TotalRow>
              <CheckoutButton onClick={() => router.push("/users/checkout")}>Checkout</CheckoutButton>
            </>
          )}
        </CartCard>
      </CartBg>
    </>
  );
}

// Styled Components

const CartBg = styled.div`
  background: #f5f8fa;
  min-height: 100vh;
  padding-top: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CartCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(5, 40, 85, 0.10);
  width: 100%;
  max-width: 520px;
  padding: 32px 24px 28px 24px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: poppins;

  @media (max-width: 700px) {
    padding: 18px 6px 12px 6px;
    max-width: 98vw;
  }
`;

const CartTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #052855;
  margin-bottom: 24px;
  text-align: center;
  font-family: poppins;
`;

const EmptyText = styled.p`
  padding: 16px;
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  font-family: poppins;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f8fa;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(5,40,85,0.04);
  padding: 16px 18px;
  font-family: poppins;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const RestaurantName = styled.div`
  font-size: 0.95rem;
  color: #2196f3;
  margin-bottom: 4px;
  font-weight: 600;
`;

const ItemName = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #052855;
  margin-bottom: 6px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const QtyButton = styled.button`
  padding: 4px 12px;
  font-weight: bold;
  font-size: 1.1rem;
  background-color: #fff;
  border: 1.5px solid #052855;
  color: #052855;
  border-radius: 6px;
  cursor: pointer;
  font-family: poppins;
  transition: background 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    background: #052855;
    color: #fff;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const QtyDisplay = styled.span`
  font-size: 1rem;
  font-weight: 600;
  font-family: poppins;
`;

const ItemRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const ItemPrice = styled.div`
  font-size: 1.1rem;
  color: #052855;
  font-weight: bold;
  font-family: poppins;
`;

const RemoveButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-family: poppins;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background 0.2s;
  &:hover {
    background-color: #e60000;
  }
`;

const Divider = styled.hr`
  margin: 18px 0 10px 0;
  border: none;
  border-top: 1.5px solid #e3e9f6;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  font-family: poppins;
`;

const TotalLabel = styled.div`
  font-size: 1.1rem;
  color: #052855;
  font-weight: 600;
`;

const TotalValue = styled.div`
  font-size: 1.3rem;
  color: #052855;
  font-weight: 700;
`;

const CheckoutButton = styled.button`
  background-color: #052855;
  color: white;
  border: none;
  padding: 14px 0;
  border-radius: 10px;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  font-family: poppins;
  transition: background 0.2s;
  &:hover {
    background-color: #034074;
  }
`;
