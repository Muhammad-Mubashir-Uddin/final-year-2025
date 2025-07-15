import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import axios from "axios";

const HeroSectionHomePage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/users/login"); // Redirect to login if no token
    }
  }, []);

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
      setFiltered([]);
      setShowResults(false);
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
      setShowResults(true);
    }
  }, [search, restaurants]);

  // Helper to highlight matched dish name
  const getHighlightedDish = (r) => {
    if (!search) return null;
    const s = search.toLowerCase();
    const availableDishes = r.restaurant.menu?.filter(item => item.isAvailable) || [];
    const match = availableDishes.find(item => item.name?.toLowerCase().includes(s));
    return match ? match.name : null;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <>
      <HeroSectionStyled>
        <h1>Craving Something? Hunt Now!</h1>
        <p>
          Want to pickup,dineIn,delivered or reservation in any restaurant? Search
          Food Now
        </p>
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for restaurants, cuisines, or dishes"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </HeroSectionStyled>
      {showResults && (
        <ResultsWrapper>
          {filtered.length === 0 ? (
            <NoResults>No matching restaurants or dishes found.</NoResults>
          ) : (
            <ResultsGrid>
              {filtered.map((r) => (
                <ResultCard
                  key={r._id}
                  onClick={() => router.push(`/users/${r._id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") router.push(`/users/${r._id}`);
                  }}
                >
                  <ImagePlaceholder>
                    <img src="/public/assests/cities/los angeles.jpg" alt="Restaurant" />
                  </ImagePlaceholder>
                  <CardContent>
                    <h2>{r.restaurant.name}</h2>
                    <p className="city">{r.restaurant.city}</p>
                    <div className="rating-row">
                      <span className="star">★</span>
                      <span className="rating">{r.avgRating?.toFixed(1) || "N/A"}</span>
                    </div>
                    {getHighlightedDish(r) && (
                      <p className="dish-highlight">Dish: <b>{getHighlightedDish(r)}</b></p>
                    )}
                  </CardContent>
                </ResultCard>
              ))}
            </ResultsGrid>
          )}
        </ResultsWrapper>
      )}
    </>
  );
};

export default HeroSectionHomePage;

const HeroSectionStyled = styled.div`
  height: 70vh;
  background-color: #f5f8fa;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 50px;
    line-height: 50px;
    color: #052855;
    margin-bottom: 15px;
  }
  .search-box {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    input {
      width: 80%;
      padding: 10px;
      padding-left: 20px;
      border-radius: 20px;
      border: none;
      outline: none;
      margin-right: 10px;
    }
    button {
      padding: 10px 20px;
      background-color: #052855;
      color: white;
      border-radius: 20px;
      border: none;
      cursor: pointer;
    }
  }
`;

const ResultsWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto 40px auto;
  padding: 0 24px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 32px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ResultCard = styled.div`
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

  &:hover,
  &:focus {
    box-shadow: 0 8px 32px rgba(5, 40, 85, 0.18);
    outline: none;
    transform: translateY(-4px) scale(1.02);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 160px;
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
  .dish-highlight {
    margin-top: 8px;
    color: #034074;
    font-size: 1.05rem;
  }
`;

const NoResults = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin-top: 32px;
`;
