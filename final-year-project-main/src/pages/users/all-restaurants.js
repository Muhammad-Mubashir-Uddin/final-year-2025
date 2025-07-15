import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/navigation";

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        const res = await axios.get("/api/user/allrestaurant", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(res.data.restaurants || []);
      } catch (error) {
        console.error("Error fetching all restaurants", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <Wrapper>
      <h1>All Restaurants</h1>
      <Grid>
        {restaurants.map((r) => (
          <RestaurantCard
            key={r._id}
            onClick={() => router.push(`/users/${r._id}`)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/users/${r._id}`);
            }}
          >
            <h2>{r.name}</h2>
            <p>{r.city}</p>
            <p>Avg Rating: {r.avgRating.toFixed(1)}</p>
            <p>Menu Items: {r.availableMenuCount}</p>
          </RestaurantCard>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default AllRestaurants;

const Wrapper = styled.div`
  padding: 24px;
  max-width: 960px;
  margin: auto;

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #052855;
    text-align: center;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RestaurantCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  h2 {
    margin: 0 0 8px;
    font-size: 1.25rem;
    font-weight: 600;
    color: #052855;
  }

  p {
    margin: 4px 0;
    color: #444;
  }

  &:hover,
  &:focus {
    box-shadow: 0 4px 15px rgba(5, 40, 85, 0.4);
    outline: none;
  }
`;
