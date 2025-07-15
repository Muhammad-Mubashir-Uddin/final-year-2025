import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import NavigationBar from "@/components/NavigationBar";
import styled from "styled-components";

const ORDER_TYPES = [
  { value: "dineIn", label: "Dine In" },
  { value: "pickUp", label: "Pick Up" },
  { value: "delivery", label: "Delivery" },
  { value: "reservations", label: "Reservations" },
];

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phoneNo: "", address: "" });
  const [orderType, setOrderType] = useState("dineIn");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setForm({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          email: res.data.user.email || "",
          phoneNo: res.data.user.phoneNo || "", 
          address: res.data.user.address || "",
        });
      } catch (err) {
        setError("Failed to fetch user info. Please login again.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setError("");
    setSuccess("");
    if (!form.firstName || !form.lastName || !form.email || !form.phoneNo || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[0-9]{11}$/.test(form.phoneNo)) {
      setError("Phone number must be exactly 11 digits.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.post(
        "/api/user/checkout",
        { cartItems, userInfo: form, orderType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        clearCart();
        setSuccess("Order placed successfully!");
        setTimeout(() => router.push("/users/home"), 2000);
      } else {
        setError(res.data.message || "Checkout failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Checkout failed. Please try again."
      );
    }
  };

  if (loading) return <Centered>Loading...</Centered>;

  return (
    <>
      <NavigationBar />
      <CheckoutWrapper>
        <CheckoutContainer>
          <LeftCol>
            <SectionTitle>Checkout</SectionTitle>
            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}
            <FormSection>
              <h3>User Info</h3>
              <form onSubmit={e => { e.preventDefault(); handlePlaceOrder(); }}>
                <InputRow>
                  <InputField>
                    <label>First Name*</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} required />
                  </InputField>
                  <InputField>
                    <label>Last Name*</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} required />
                  </InputField>
                </InputRow>
                <InputRow>
                  <InputField>
                    <label>Email*</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required />
                  </InputField>
                  <InputField>
                    <label>Phone*</label>
                    <input name="phoneNo" value={form.phoneNo} onChange={handleChange} required />
                  </InputField>
                </InputRow>
                <InputRow>
                  <InputField style={{ flex: 1 }}>
                    <label>Order Type*</label>
                    <select
                      name="orderType"
                      value={orderType}
                      onChange={e => setOrderType(e.target.value)}
                      required
                    >
                      {ORDER_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </InputField>
                  <InputField style={{ flex: 2 }}>
                    <label>Address*</label>
                    <input name="address" value={form.address} onChange={handleChange} required />
                  </InputField>
                </InputRow>
              </form>
            </FormSection>
            <PlaceOrderBtn
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || loading}
            >
              Place Order
            </PlaceOrderBtn>
          </LeftCol>
          <RightCol>
            <SummaryCard>
              <h3>Order Summary</h3>
              {cartItems.length === 0 ? (
                <EmptyCart>Your cart is empty.</EmptyCart>
              ) : (
                <ul>
                  {cartItems.map((item) => (
                    <li key={item.menuItemId}>
                      <div className="item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                        <span className="item-price">Rs. {item.price * item.quantity}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="total-row">
                <span>Total:</span>
                <span className="total">Rs. {total.toFixed(2)}</span>
              </div>
            </SummaryCard>
          </RightCol>
        </CheckoutContainer>
      </CheckoutWrapper>
    </>
  );
}

const CheckoutWrapper = styled.div`
  background: #f5f8fa;
  min-height: 100vh;
  padding-top: 110px;
`;

const CheckoutContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: 32px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 0;
  }
`;

const LeftCol = styled.div`
  flex: 2;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(5, 40, 85, 0.08);
  padding: 32px 28px 24px 28px;
  margin-bottom: 32px;
`;

const RightCol = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(5, 40, 85, 0.08);
  padding: 32px 24px 24px 24px;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #052855;
  margin-bottom: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
  h3 {
    color: #052855;
    font-size: 1.2rem;
    margin-bottom: 18px;
    font-weight: 600;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0;
  }
`;

const InputField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  label {
    font-size: 1rem;
    color: #052855;
    margin-bottom: 6px;
    font-weight: 500;
  }
  input, select {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #cfd8dc;
    font-size: 1rem;
    outline: none;
    color: #052855;
    background: #f5f8fa;
    margin-bottom: 2px;
    transition: border 0.2s;
    &:focus {
      border: 1.5px solid #052855;
    }
  }
`;

const PlaceOrderBtn = styled.button`
  width: 100%;
  background: #052855;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 16px 0;
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 12px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #034074;
  }
  &:disabled {
    background: #b0b8c1;
    cursor: not-allowed;
  }
`;

const SummaryCard = styled.div`
  h3 {
    color: #052855;
    font-size: 1.2rem;
    margin-bottom: 18px;
    font-weight: 600;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 18px 0;
  }
  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 1rem;
    color: #052855;
  }
  .item-name {
    flex: 2;
    font-weight: 500;
  }
  .item-qty {
    flex: 1;
    text-align: center;
    color: #666;
  }
  .item-price {
    flex: 1;
    text-align: right;
    color: #052855;
    font-weight: 600;
  }
  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.15rem;
    font-weight: 700;
    margin-top: 18px;
    color: #052855;
    border-top: 2px solid #e0e0e0;
    padding-top: 12px;
  }
`;

const Alert = styled.div`
  background: ${({ type }) => (type === "error" ? "#ffeaea" : "#eaffea")};
  color: ${({ type }) => (type === "error" ? "#d32f2f" : "#388e3c")};
  border: 1px solid ${({ type }) => (type === "error" ? "#ffcdd2" : "#c8e6c9")};
  border-radius: 8px;
  padding: 12px 18px;
  margin-bottom: 18px;
  font-size: 1rem;
`;

const EmptyCart = styled.div`
  color: #888;
  font-size: 1.1rem;
  text-align: center;
  margin: 18px 0;
`;

const Centered = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #052855;
`; 