import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/navigation";

const TopRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      try {
        const res = await axios.get("/api/user/topresturants", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(res.data.restaurants || []);
      } catch (error) {
        console.error("Error fetching top restaurants", error);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(restaurants.filter(r => r.restaurant.menu?.some(item => item.isAvailable)));
    } else {
      const s = search.toLowerCase();
      setFiltered(
        restaurants.filter((r) => {
          const availableDishes = r.restaurant.menu?.filter(item => item.isAvailable) || [];
          const restMatch =
            r.restaurant.name?.toLowerCase().includes(s) ||
            r.restaurant.city?.toLowerCase().includes(s);
          const dishMatch = availableDishes.some(item => item.name?.toLowerCase().includes(s));
          return (restMatch || dishMatch) && availableDishes.length > 0;
        })
      );
    }
  }, [search, restaurants]);

  return (
    <Wrapper>
      <h1>Top Restaurants</h1>
      <Grid>
        {filtered.map((r) => (
          <RestaurantCard
            key={r._id}
            onClick={() => router.push(`/users/${r._id}`)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/users/${r._id}`);
            }}
          >
            <ImagePlaceholder>
              {/* Show profile image if available, else fallback */}
              <img
                src={r.restaurant.profileImage || "/assests/cities/los angeles.jpg"}
                alt="Restaurant"
                style={{ borderRadius: "50%", width: 90, height: 90, objectFit: "cover", margin: "16px auto" }}
              />
            </ImagePlaceholder>
            <CardContent>
              <h2>{r.restaurant.name}</h2>
              <p className="address">{r.restaurant.address}</p>
              <p className="city">{r.restaurant.city}</p>
              <div className="rating-row">
                <span className="star">★</span>
                <span className="rating">{r.avgRating?.toFixed(1) || "N/A"}</span>
              </div>
              <p className="menu-count">Menu Items: {r.restaurant.menu?.filter(item => item.isAvailable).length ?? 0}</p>
            </CardContent>
          </RestaurantCard>
        ))}
      </Grid>
      <ButtonRow>
        <ViewAllButton onClick={() => router.push("/users/all-restaurants")}>View All Restaurants</ViewAllButton>
      </ButtonRow>
    </Wrapper>
  );
};

export default TopRestaurants;

const Wrapper = styled.div`
  padding: 24px;
  max-width: 1100px;
  margin: auto;
  padding-top: 32px;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 28px;
    color: #052855;
    text-align: center;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 8px 0;
  justify-items: center;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RestaurantCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(5, 40, 85, 0.08);
  padding: 0;
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 320px;
  width: 100%;
  max-width: 320px;

  &:hover,
  &:focus {
    box-shadow: 0 8px 32px rgba(5, 40, 85, 0.18);
    outline: none;
    transform: translateY(-4px) scale(1.02);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 140px;
  background: #e9eef6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const CardContent = styled.div`
  padding: 20px 18px 16px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;

  h2 {
    margin: 0 0 8px;
    font-size: 1.3rem;
    font-weight: 700;
    color: #052855;
  }
  .address {
    color: #888;
    font-size: 0.98rem;
    margin-bottom: 4px;
  }
  .city {
    color: #666;
    font-size: 1rem;
    margin-bottom: 10px;
  }
  .rating-row {
    display: flex;
    align-items: center;
    margin-top: auto;
    font-size: 1.1rem;
    color: #f7b500;
    font-weight: 600;
  }
  .star {
    margin-right: 6px;
    font-size: 1.2rem;
    color: #f7b500;
  }
  .rating {
    color: #052855;
    font-weight: 700;
  }
  .menu-count {
    color: #052855;
    font-size: 1rem;
    margin-top: 8px;
    font-weight: 600;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const ViewAllButton = styled.button`
  background: #052855;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #034074;
  }
`;
