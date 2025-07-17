// pages/user/orders.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import NavigationBar from "@/components/NavigationBar";
import Modal from "react-modal";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";

const statusColors = {
  pending: "#f7b500",
  accepted: "#2196f3",
  completed: "#4caf50",
  rejected: "#f44336",
};

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { addToCart, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      try {
        const res = await axios.get("/api/user/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const token = localStorage.getItem("userToken");
    try {
      await axios.delete("/api/user/orders", {
        headers: { Authorization: `Bearer ${token}` },
        data: { orderId },
      });
      setOrders((prev) => prev.map(o => o.orderId === orderId ? { ...o, status: "cancelled" } : o));
      alert("Order cancelled successfully.");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to cancel order.";
      alert(msg);
    }
  };

  const handleEditClick = (order) => {
    clearCart();
    // Add all items to cart
    order.items.forEach(item => {
      // If menuItemId is not present, fallback to name+price as unique
      addToCart({
        ...item,
        menuItemId: item.menuItemId || `${item.name}-${item.price}`,
      });
    });
    router.push("/users/cart");
  };

  return (
    <>
      <NavigationBar />
      <OrdersWrapper>
        <OrdersTitle>My Orders</OrdersTitle>
        {orders.length === 0 ? (
          <EmptyState>No orders found.</EmptyState>
        ) : (
          orders
            .slice()
            .reverse()
            .map((order, index) => (
              <OrderCard key={index}>
                <OrderHeader onClick={() => setExpandedOrder(expandedOrder === index ? null : index)}>
                  <div>
                    <OrderDate>
                      {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </OrderDate>
                    <OrderTotal>Total: <b>Rs. {order.totalPrice.toFixed(2)}</b></OrderTotal>
                  </div>
                  <StatusBadge $status={order.status}>{order.status}</StatusBadge>
                  <ExpandIcon>{expandedOrder === index ? "▲" : "▼"}</ExpandIcon>
                </OrderHeader>
                {expandedOrder === index && (
                  <OrderDetails>
                    <InfoRow>
                      <span><b>Name:</b> {order.customerName}</span>
                      <span><b>Email:</b> {order.customerEmail}</span>
                    </InfoRow>
                    <InfoRow>
                      <span><b>Restaurant:</b> {order.restaurantName || 'N/A'}</span>
                    </InfoRow>
                    <InfoRow>
                      <span><b>Phone:</b> {order.customerPhone}</span>
                      <span><b>Address:</b> {order.customerAddress}</span>
                    </InfoRow>
                    <ItemsTitle>Items</ItemsTitle>
                    <ItemsList>
                      {order.items.map((item, i) => (
                        <ItemRow key={i}>
                          <span className="item-name">{item.name}</span>
                          <span className="item-qty">x{item.quantity}</span>
                          <span className="item-price">Rs. {item.price.toFixed(2)}</span>
                        </ItemRow>
                      ))}
                    </ItemsList>
                    <OrderSummary>
                      <span>Subtotal:</span>
                      <span>Rs. {order.totalPrice.toFixed(2)}</span>
                    </OrderSummary>
                    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                      {order.status === "pending" && (
                        <button style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}
                          onClick={() => handleCancel(order.orderId)}>
                          Cancel
                        </button>
                      )}
                      {["pending", "accepted"].includes(order.status) && (
                        <button style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}
                          onClick={() => handleEditClick(order)}>
                          Edit & Re-Order
                        </button>
                      )}
                    </div>
                  </OrderDetails>
                )}
              </OrderCard>
            ))
        )}
      </OrdersWrapper>
    </>
  );
};

export default UserOrdersPage;

const OrdersWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 16px 32px 16px;
  min-height: 100vh;
  // background: #f5f8fa;
`;

const OrdersTitle = styled.h2`
  margin-top: 100px;
  margin-bottom: 36px;
  text-align: center;
  color: #052855;
  font-size: 2rem;
  font-weight: 700;
`;

const EmptyState = styled.div`
  color: #888;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 60px;
`;

const OrderCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(5, 40, 85, 0.08);
  margin-bottom: 28px;
  overflow: hidden;
  transition: box-shadow 0.2s;
`;

const OrderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 28px;
  cursor: pointer;
  background: #f0f4fa;
  border-bottom: 1px solid #e0e0e0;
  gap: 18px;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 18px 12px;
  }
`;

const OrderDate = styled.div`
  color: #666;
  font-size: 1.05rem;
  margin-bottom: 4px;
`;

const OrderTotal = styled.div`
  color: #052855;
  font-size: 1.1rem;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  background: ${({ $status }) => statusColors[$status] || "#b0b8c1"};
  color: #fff;
  border-radius: 8px;
  padding: 6px 18px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const ExpandIcon = styled.span`
  font-size: 1.3rem;
  color: #052855;
  margin-left: 10px;
`;

const OrderDetails = styled.div`
  padding: 24px 28px 18px 28px;
  background: #fff;
  @media (max-width: 600px) {
    padding: 16px 10px 10px 10px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: #052855;
  font-size: 1rem;
  margin-bottom: 8px;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 2px;
  }
`;

const ItemsTitle = styled.h4`
  color: #052855;
  font-size: 1.1rem;
  margin: 18px 0 8px 0;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 1rem;
  .item-name {
    flex: 2;
    font-weight: 500;
    color: #052855;
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
`;

const OrderSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: #052855;
  border-top: 2px solid #e0e0e0;
  padding-top: 10px;
`;
