import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaEye } from "react-icons/fa";
import RestaurantLayout from "@/components/RestaurantLayout";
import { useRouter } from "next/router";

const API_URL = "/api/resturant/acceptedOrders";

export default function AcceptedOrders() {
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
        if (!res.ok) throw new Error("Failed to fetch accepted orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Error fetching accepted orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <RestaurantLayout>
      <AcceptedOrdersStyled>
        <div className="container">
          <h3>Accepted Orders</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : orders.length === 0 ? (
            <p>No accepted orders.</p>
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
                    <td>
                      {order.status === "accepted" ? (
                        <button
                          onClick={async () => {
                            const token = localStorage.getItem("token");
                            try {
                              const res = await fetch("/api/resturant/newOrders", {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  orderNumber: order.orderNumber,
                                  status: "completed",
                                }),
                              });
                              if (res.ok) {
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o.orderNumber === order.orderNumber
                                      ? { ...o, status: "completed" }
                                      : o
                                  )
                                );
                              } else {
                                alert("Failed to mark as completed");
                              }
                            } catch (err) {
                              alert("Error: " + err.message);
                            }
                          }}
                          style={{
                            background: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '6px 14px',
                            cursor: 'pointer',
                          }}
                        >
                          Completed
                        </button>
                      ) : (
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>Completed</span>
                      )}
                    </td>
                    <td>
                      <FaEye
                        className="view-icon"
                        onClick={() => setSelectedOrder(order)}
                        style={{ color: selectedOrder && selectedOrder.orderNumber === order.orderNumber ? '#007bff' : undefined }}
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
                {selectedOrder.acceptedDate && (
                  <p><strong>Accepted At:</strong> {new Date(selectedOrder.acceptedDate).toLocaleString()}</p>
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
      </AcceptedOrdersStyled>
    </RestaurantLayout>
  );
}

const AcceptedOrdersStyled = styled.div`
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
    color: #333;
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