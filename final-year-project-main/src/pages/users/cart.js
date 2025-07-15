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

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        "/api/user/checkout",
        { cartItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        clearCart();
        alert("Order placed!");
        router.push("/user/home");
      } else {
        alert(res.data.message || "Checkout failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed.");
    }
  };

  return (
    <>
      <NavigationBar />
      <PageWrapper>
        <Wrapper>
          <Title>Your Cart</Title>
          {cartItems.length === 0 ? (
            <EmptyText>No items in cart.</EmptyText>
          ) : (
            <>
              <Items>
                {cartItems.map((item) => (
                  <Item key={item.menuItemId}>
                    <Details>
                      <RestaurantName>
                        From: {item.restaurantName}
                      </RestaurantName>
                      <ItemText>{item.name}</ItemText>
                      <QuantityControls>
                        <QtyButton
                          onClick={() =>
                            updateQuantity(item.menuItemId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </QtyButton>
                        <QtyDisplay>{item.quantity}</QtyDisplay>
                        <QtyButton
                          onClick={() =>
                            updateQuantity(item.menuItemId, item.quantity + 1)
                          }
                        >
                          +
                        </QtyButton>
                      </QuantityControls>
                    </Details>
                    <RightSection>
                      <ItemPrice>Rs. {item.price * item.quantity}</ItemPrice>
                      <RemoveButton
                        onClick={() => removeFromCart(item.menuItemId)}
                      >
                        Remove
                      </RemoveButton>
                    </RightSection>
                  </Item>
                ))}
              </Items>
              <Divider />
              <Total>Total: Rs. {total.toFixed(2)}</Total>
              <CheckoutButton onClick={handleCheckout}>Checkout</CheckoutButton>
            </>
          )}
        </Wrapper>
      </PageWrapper>
    </>
  );
}

// Styled Components

const PageWrapper = styled.div`
  padding-top: 120px; /* space for fixed nav */
`;

const Wrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 24px;
`;

const EmptyText = styled.p`
  padding: 16px;
  text-align: center;
  font-size: 1.2rem;
  color: #555;
`;

const Items = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const RestaurantName = styled.div`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 4px;
`;

const ItemText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const QtyButton = styled.button`
  padding: 4px 10px;
  font-weight: bold;
  font-size: 1.1rem;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const QtyDisplay = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ItemPrice = styled.div`
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
`;

const RemoveButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background-color: #e60000;
  }
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  border-top: 1px solid #ddd;
`;

const Total = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-align: right;
  margin-bottom: 16px;
`;

const CheckoutButton = styled.button`
  background-color: #052855;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    background-color: #041f3d;
  }
`;
