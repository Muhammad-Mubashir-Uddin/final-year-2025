import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get("/api/user/topproducts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.products || []);
      } catch (err) {
        setError("Failed to fetch top rated products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      menuItemId: product._id,
      name: product.name,
      price: product.price,
      restaurantName: product.restaurantName,
      restaurantId: product.restaurantId,
      quantity: 1,
    });
  };

  const handleOrderNow = (product) => {
    handleAddToCart(product);
    router.push("/users/checkout");
  };

  return (
    <Section>
      <SectionTitle>Top Rated Products</SectionTitle>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : error ? (
        <ErrorMsg>{error}</ErrorMsg>
      ) : products.length === 0 ? (
        <Empty>No top rated products found.</Empty>
      ) : (
        <CenterWrap>
          <ProductsGrid>
            {products.map((p) => (
              <ProductCard key={p._id}>
                <ImageWrap>
                  <img
                    src={p.image || "/assests/cities/los angeles.jpg"}
                    alt={p.name}
                    style={{ borderRadius: "50%", width: 90, height: 90, objectFit: "cover", margin: "16px auto" }}
                  />
                </ImageWrap>
                <CardContent>
                  <ProductName>{p.name}</ProductName>
                  <RestaurantName>{p.restaurantName} ({p.city})</RestaurantName>
                  <Price>Rs. {p.price}</Price>
                  <RatingRow>
                    <span className="star">★</span>
                    <span className="rating">{p.avgRating?.toFixed(1) || "N/A"}</span>
                    <span className="count">({p.reviewCount})</span>
                  </RatingRow>
                  <ButtonRow>
                    <CartButton onClick={() => handleAddToCart(p)}>Add to Cart</CartButton>
                    <OrderNowButton onClick={() => handleOrderNow(p)}>Order Now</OrderNowButton>
                  </ButtonRow>
                </CardContent>
              </ProductCard>
            ))}
          </ProductsGrid>
        </CenterWrap>
      )}
    </Section>
  );
};

export default TopProducts;

const Section = styled.div`
  margin: 32px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CenterWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #052855;
  margin-bottom: 18px;
  text-align: center;
`;

const Loading = styled.div`
  text-align: center;
  color: #052855;
  font-size: 1.1rem;
`;

const ErrorMsg = styled.div`
  color: #ff4d4d;
  text-align: center;
  font-size: 1.1rem;
`;

const Empty = styled.div`
  color: #555;
  text-align: center;
  font-size: 1.1rem;
`;

const ProductsGrid = styled.div`
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

const ProductCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(5, 40, 85, 0.08);
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 320px;
  width: 100%;
  max-width: 320px;
`;

const ImageWrap = styled.div`
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
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductName = styled.h3`
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #052855;
`;

const RestaurantName = styled.div`
  color: #2196f3;
  font-size: 0.98rem;
  margin-bottom: 6px;
  font-weight: 600;
`;

const Price = styled.div`
  color: #052855;
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  color: #f7b500;
  font-weight: 600;
  .star {
    margin-right: 6px;
    font-size: 1.2rem;
    color: #f7b500;
  }
  .rating {
    color: #052855;
    font-weight: 700;
    margin-right: 4px;
  }
  .count {
    color: #888;
    font-size: 0.95rem;
    margin-left: 4px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: center;
`;

const CartButton = styled.button`
  background: #fff;
  color: #052855;
  border: 2px solid #052855;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-family: poppins;
  &:hover {
    background: #052855;
    color: #fff;
  }
`;

const OrderNowButton = styled.button`
  background: #052855;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  font-family: poppins;
  transition: background 0.2s;
  &:hover {
    background: #034074;
  }
`; 