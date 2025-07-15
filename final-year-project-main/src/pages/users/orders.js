// pages/user/orders.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import NavigationBar from "@/components/NavigationBar";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        const res = await axios.get("/api/user/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <NavigationBar />
      <OrdersStyled>
        <h2>All Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders
            .slice()
            .reverse()
            .map((order, index) => (
              <div key={index} className="order-box">
                <div
                  className="order-header"
                  onClick={() =>
                    setExpandedOrder(expandedOrder === index ? null : index)
                  }
                >
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
                  </p>
                  <span>{expandedOrder === index ? "▲" : "▼"}</span>
                </div>
                {expandedOrder === index && (
                  <div className="order-details">
                    <p>
                      <strong>Name:</strong> {order.customerName}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.customerEmail}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.customerPhone}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.customerAddress}
                    </p>
                    <h4>Items:</h4>
                    <ul>
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.name} - Qty: {item.quantity} - $
                          {item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                  </div>
                )}
              </div>
            ))
        )}
      </OrdersStyled>
    </>
  );
};

export default UserOrdersPage;

const OrdersStyled = styled.div`
  max-width: 700px;
  margin: auto;
  padding: 30px;
  .order-box {
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 20px;
    background: #f2f2f2;
  }

  .order-header {
    padding: 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-details {
    padding: 15px;
    background: #fff;

    ul {
      margin-top: 10px;
      padding-left: 20px;
    }
  }

  h2 {
    margin-top: 100px;
    margin-bottom: 30px;
    text-align: center;
    color: #052855;
  }
`;
