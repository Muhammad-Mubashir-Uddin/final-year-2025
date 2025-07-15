import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import NavigationBar from "@/components/NavigationBar";
import StarRating from "@/components/StarRating";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

const RestaurantDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, alertMessage, clearAlert } = useCart();
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState({ rating: 0, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  // Add state for dish reviews
  const [dishReviews, setDishReviews] = useState({}); // { [menuItemId]: { reviews, myReview, loading, error, success } }

  // Helper to get review state for a dish
  const getDishReviewState = (id) => dishReviews[id] || { reviews: [], myReview: { rating: 0, comment: "" }, loading: false, error: "", success: "" };

  // Handle review change for a dish
  const handleDishReviewChange = (menuItemId, field, value) => {
    setDishReviews((prev) => ({
      ...prev,
      [menuItemId]: {
        ...getDishReviewState(menuItemId),
        myReview: { ...getDishReviewState(menuItemId).myReview, [field]: value },
      },
    }));
  };

  // Submit review for a dish
  const handleDishReviewSubmit = async (e, menuItemId) => {
    e.preventDefault();
    setDishReviews((prev) => ({
      ...prev,
      [menuItemId]: { ...getDishReviewState(menuItemId), loading: true, error: "", success: "" },
    }));
    try {
      const token = localStorage.getItem("userToken");
      const myReview = getDishReviewState(menuItemId).myReview;
      const res = await axios.post(
        "/api/user/review/menuitem",
        { restaurantId: restaurant._id, menuItemId, rating: myReview.rating, comment: myReview.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local dishReviews state
      setDishReviews((prev) => ({
        ...prev,
        [menuItemId]: {
          ...getDishReviewState(menuItemId),
          reviews: res.data.reviews,
          loading: false,
          success: "Review submitted!",
          error: "",
        },
      }));
      // Update restaurant.menu item's reviews so UI updates immediately
      setRestaurant((prev) => {
        if (!prev) return prev;
        const updatedMenu = prev.menu.map(item =>
          item._id === menuItemId ? { ...item, reviews: res.data.reviews } : item
        );
        return { ...prev, menu: updatedMenu };
      });
      setTimeout(() => setDishReviews((prev) => ({ ...prev, [menuItemId]: { ...getDishReviewState(menuItemId), success: "" } })), 2000);
    } catch (err) {
      setDishReviews((prev) => ({
        ...prev,
        [menuItemId]: {
          ...getDishReviewState(menuItemId),
          loading: false,
          error: err.response?.data?.message || "Failed to submit review.",
          success: "",
        },
      }));
    }
  };

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

  useEffect(() => {
    if (restaurant && restaurant.reviews) {
      setReviews(restaurant.reviews);
    }
  }, [restaurant]);

  const fetchUserReview = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      // Find user's review if exists
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      const found = (restaurant.reviews || []).find(r => r.userId === userId);
      if (found) setMyReview({ rating: found.rating, comment: found.comment });
    } catch {}
  };
  useEffect(() => { if (restaurant) fetchUserReview(); }, [restaurant]);

  const handleReviewChange = (field, value) => {
    setMyReview(r => ({ ...r, [field]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        "/api/user/review/restaurant",
        { restaurantId: restaurant._id, rating: myReview.rating, comment: myReview.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(res.data.reviews);
      setReviewSuccess("Review submitted!");
      setTimeout(() => setReviewSuccess(""), 2000);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <LoadingText>Loading...</LoadingText>;

  if (!restaurant) return <LoadingText>No restaurant found.</LoadingText>;

  return (
    <>
    <div>
    <NavigationBar />
    </div>
      
      {alertMessage && (
        <AlertBox>
          {alertMessage}
          <CloseBtn onClick={clearAlert}>&times;</CloseBtn>
        </AlertBox>
      )}
      <Wrapper>
        <Title>{restaurant.name}</Title>
        <Address>
          {restaurant.address}, {restaurant.city}
        </Address>
        {/* Restaurant Review Form & List */}
        <ReviewSection>
          <h3>Rate & Review this Restaurant</h3>
          <form onSubmit={handleReviewSubmit}>
            <StarRating
              value={myReview.rating}
              onChange={val => handleReviewChange("rating", val)}
            />
            <ReviewInput
              placeholder="Write your review..."
              value={myReview.comment}
              onChange={e => handleReviewChange("comment", e.target.value)}
              rows={3}
              required
            />
            <ReviewBtn type="submit" disabled={reviewLoading || !myReview.rating}>
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </ReviewBtn>
            {reviewError && <ReviewAlert type="error">{reviewError}</ReviewAlert>}
            {reviewSuccess && <ReviewAlert type="success">{reviewSuccess}</ReviewAlert>}
          </form>
          <ReviewList>
            <h4>All Reviews</h4>
            {reviews.length === 0 ? (
              <NoReviews>No reviews yet.</NoReviews>
            ) : (
              reviews.slice().reverse().map((r, idx) => (
                <ReviewItem key={idx}>
                  <ReviewHeader>
                    <b>{r.name || "User"}</b>
                    <StarRating value={r.rating} readOnly small />
                  </ReviewHeader>
                  <ReviewComment>{r.comment}</ReviewComment>
                  <ReviewDate>{new Date(r.createdAt).toLocaleString()}</ReviewDate>
                </ReviewItem>
              ))
            )}
          </ReviewList>
        </ReviewSection>
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
              // Dish review state
              const dishState = getDishReviewState(item._id);
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
                        onClick={async () => {
                          await addToCart(cartItem);
                          router.push("/users/checkout");
                        }}
                      >
                        Order Now
                      </OutlineButton>
                    </ButtonRow>
                    {/* Dish Review Form & List */}
                    <DishReviewSection>
                      <h4>Rate & Review this Dish</h4>
                      <form onSubmit={e => handleDishReviewSubmit(e, item._id)}>
                        <StarRating
                          value={dishState.myReview.rating}
                          onChange={val => handleDishReviewChange(item._id, "rating", val)}
                        />
                        <ReviewInput
                          placeholder="Write your review..."
                          value={dishState.myReview.comment}
                          onChange={e => handleDishReviewChange(item._id, "comment", e.target.value)}
                          rows={2}
                          required
                        />
                        <ReviewBtn type="submit" disabled={dishState.loading || !dishState.myReview.rating}>
                          {dishState.loading ? "Submitting..." : "Submit Review"}
                        </ReviewBtn>
                        {dishState.error && <ReviewAlert type="error">{dishState.error}</ReviewAlert>}
                        {dishState.success && <ReviewAlert type="success">{dishState.success}</ReviewAlert>}
                      </form>
                      <ReviewList>
                        <h5>Dish Reviews</h5>
                        {(item.reviews || dishState.reviews || []).length === 0 ? (
                          <NoReviews>No reviews yet.</NoReviews>
                        ) : (
                          (dishState.reviews.length > 0 ? dishState.reviews : item.reviews).slice().reverse().map((r, idx) => (
                            <ReviewItem key={idx}>
                              <ReviewHeader>
                                <b>{r.name || "User"}</b>
                                <StarRating value={r.rating} readOnly small />
                              </ReviewHeader>
                              <ReviewComment>{r.comment}</ReviewComment>
                              <ReviewDate>{new Date(r.createdAt).toLocaleString()}</ReviewDate>
                            </ReviewItem>
                          ))
                        )}
                      </ReviewList>
                    </DishReviewSection>
                  </MenuCardContent>
                </MenuCard>
              );
            })}
          </MenuGrid>
        </MenuSection>
      </Wrapper>
      <ChatbotWidget />
    </>
  );
};

const LoadingText = styled.p`
  padding: 16px;
  text-align: center;
  font-size: 1.2rem;
  color: #555;
`;

const Wrapper = styled.div`
  // max-width: 960px;
  // margin: 60px auto 40px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 24px;padding-top:100px;
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

const AlertBox = styled.div`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #052855;
  color: #fff;
  padding: 12px 32px 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px #05285544;
  z-index: 1000;
  font-size: 1rem;
  display: flex;
  align-items: center;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  margin-left: 16px;
  cursor: pointer;
`;

const ReviewSection = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 32px auto 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #05285522;
  padding: 28px 24px 18px 24px;
`;
const ReviewInput = styled.textarea`
  width: 100%;
  border-radius: 8px;
  border: 1px solid #cfd8dc;
  padding: 10px 14px;
  font-size: 1rem;
  margin: 12px 0 8px 0;
  resize: vertical;
  background: #f5f8fa;
  color: #052855;
`;
const ReviewBtn = styled.button`
  background: #052855;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
  &:hover {
    background: #034074;
  }
  &:disabled {
    background: #b0b8c1;
    cursor: not-allowed;
  }
`;
const ReviewAlert = styled.div`
  background: ${({ type }) => (type === "error" ? "#ffeaea" : "#eaffea")};
  color: ${({ type }) => (type === "error" ? "#d32f2f" : "#388e3c")};
  border: 1px solid ${({ type }) => (type === "error" ? "#ffcdd2" : "#c8e6c9")};
  border-radius: 8px;
  padding: 8px 14px;
  margin-bottom: 10px;
  font-size: 0.98rem;
`;
const ReviewList = styled.div`
  margin-top: 18px;
`;
const NoReviews = styled.div`
  color: #888;
  font-size: 1rem;
  text-align: center;
  margin: 18px 0;
`;
const ReviewItem = styled.div`
  background: #f5f8fa;
  border-radius: 8px;
  padding: 12px 16px 8px 16px;
  margin-bottom: 12px;
`;
const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;
const ReviewComment = styled.div`
  color: #052855;
  font-size: 1.05rem;
  margin-bottom: 4px;
`;
const ReviewDate = styled.div`
  color: #888;
  font-size: 0.92rem;
`;

const DishReviewSection = styled.div`
  margin-top: 18px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 14px 12px 10px 12px;
`;

export default RestaurantDetail;
