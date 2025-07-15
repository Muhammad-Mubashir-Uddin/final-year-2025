import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import NavigationBar from "@/components/NavigationBar";

const RestaurantDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        const res = await axios.get(`/api/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched restaurant data:", res.data.restaurant);
        setRestaurant(res.data.restaurant);
      } catch (error) {
        console.error("Error fetching restaurant details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <LoadingText>Loading...</LoadingText>;

  if (!restaurant) return <LoadingText>No restaurant found.</LoadingText>;

  return (
    <>
      <NavigationBar />
      <Wrapper>
        <Title>{restaurant.name}</Title>
        <Address>
          {restaurant.address}, {restaurant.city}
        </Address>
        <MenuSection>
          <MenuTitle>Menu</MenuTitle>
          <MenuGrid>
            {restaurant.menu.map((item, index) => {
              const cartItem = {
                menuItemId: item._id,
                name: item.name,
                price: item.price,
                restaurantId: restaurant._id,
                restaurantName: restaurant.name,
              };

              return (
                <MenuCard key={index}>
                  <MenuCardContent>
                    <MenuItemName>{item.name}</MenuItemName>
                    <MenuItemDesc>{item.description}</MenuItemDesc>
                    <MenuItemPrice>Rs. {item.price}</MenuItemPrice>
                    <ButtonRow>
                      <Button
                        onClick={() => {
                          console.log("Adding to cart:", cartItem);
                          addToCart(cartItem);
                        }}
                      >
                        Add to Cart
                      </Button>
                      <OutlineButton
                        onClick={() => alert(`Order ${item.name} now`)}
                      >
                        Order Now
                      </OutlineButton>
                    </ButtonRow>
                  </MenuCardContent>
                </MenuCard>
              );
            })}
          </MenuGrid>
        </MenuSection>
      </Wrapper>
    </>
  );
};

export default RestaurantDetail;

// Styles (same as before)

const LoadingText = styled.p`
  padding: 16px;
  text-align: center;
  font-size: 1.2rem;
  color: #555;
`;

const Wrapper = styled.div`
  max-width: 960px;
  margin: 60px auto 40px;
  padding: 0 24px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #052855;
  margin-bottom: 8px;
`;

const Address = styled.p`
  color: #555;
  font-size: 1rem;
  margin-bottom: 24px;
`;

const MenuSection = styled.div`
  margin-top: 24px;
`;

const MenuTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #052855;
`;

const MenuGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MenuCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
`;

const MenuCardContent = styled.div`
  padding: 16px;
`;

const MenuItemName = styled.h3`
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 6px;
  color: #052855;
`;

const MenuItemDesc = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
`;

const MenuItemPrice = styled.p`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  background-color: #052855;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #034074;
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  color: #052855;
  border: 2px solid #052855;

  &:hover {
    background-color: #052855;
    color: white;
  }
`;
