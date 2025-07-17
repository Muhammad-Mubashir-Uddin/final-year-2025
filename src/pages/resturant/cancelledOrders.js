import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaBan } from "react-icons/fa";
import RestaurantLayout from "@/components/RestaurantLayout";
import { useRouter } from "next/router";

const API_URL = "/api/resturant/cancelledOrders";

export default function CancelledOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch cancelled orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Error fetching cancelled orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <RestaurantLayout>
      <CancelledOrdersStyled>
        <div className="container">
          <h3><FaBan style={{marginRight:8}}/>Cancelled Orders</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : orders.length === 0 ? (
            <p>No cancelled orders.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Customer Name</th>
                  <th>Address</th>
                  <th>Order Type</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderNumber}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.address}</td>
                    <td>{order.orderType}</td>
                    <td>{order.status}</td>
                    <td>
                      <FaBan
                        className="view-icon"
                        onClick={() => setSelectedOrder(order)}
                        style={{ color: selectedOrder && selectedOrder.orderNumber === order.orderNumber ? '#f44336' : undefined }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Modal for order details */}
          {selectedOrder && (
            <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>&times;</button>
                <h3>Order Details</h3>
                <p><strong>Order No:</strong> {selectedOrder.orderNumber}</p>
                <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
                <p><strong>Order Type:</strong> {selectedOrder.orderType}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total Price:</strong> Rs. {selectedOrder.totalPrice}</p>
                {selectedOrder.cancelledDate && (
                  <p><strong>Cancelled At:</strong> {new Date(selectedOrder.cancelledDate).toLocaleString()}</p>
                )}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <>
                    <h4>Items:</h4>
                    <ul>
                      {selectedOrder.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} x {item.quantity} (Rs. {item.price * item.quantity})
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </CancelledOrdersStyled>
    </RestaurantLayout>
  );
}

const CancelledOrdersStyled = styled.div`
  .container {
    background: #fff;
    border-radius: 15px;
    padding: 20px;
    margin-top: 10px;
    width: 100%;
  }
  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #052855;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    color: #052855;
  }
  .view-icon {
    color: #f44336;
    font-size: 18px;
    cursor: pointer;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal {
    background: #fff;
    border-radius: 10px;
    padding: 30px 24px 24px 24px;
    min-width: 320px;
    max-width: 90vw;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 16px;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #333;
    cursor: pointer;
  }
`; 