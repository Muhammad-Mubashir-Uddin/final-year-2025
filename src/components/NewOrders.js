import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaEye } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";

const API_URL = "/api/resturant/newOrders";

const NewOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  const isDashboardPage = router.pathname === "/resturant/dashboard";

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle order action
  const handleAction = async (orderNumber, status) => {
    setActionLoading((prev) => ({ ...prev, [orderNumber]: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderNumber, status }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      // Remove or update order in UI
      setOrders((prev) => prev.filter((o) => o.orderNumber !== orderNumber));
    } catch (err) {
      alert(err.message || "Error updating order");
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderNumber]: false }));
    }
  };

  return (
    <NewOrdersStyled>
      <div className="container">
        <h3>New Orders</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : orders.length === 0 ? (
          <p>No new orders.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order No</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Order Type</th>
                <th>Action</th>
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
                    <button
                      className="approve-btn"
                      disabled={actionLoading[order.orderNumber]}
                      onClick={() => handleAction(order.orderNumber, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      disabled={actionLoading[order.orderNumber]}
                      onClick={() => handleAction(order.orderNumber, "rejected")}
                    >
                      Reject
                    </button>
                    <button
                      className="approve-btn"
                      style={{ background: "#007bff" }}
                      disabled={actionLoading[order.orderNumber]}
                      onClick={() => handleAction(order.orderNumber, "completed")}
                    >
                      Complete
                    </button>
                  </td>
                  <td>{order.status}</td>
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
        {isDashboardPage && (
          <div className="button-center">
            <Link href="/resturant/new-orders">
              <button className="view-all-btn">View All</button>
            </Link>
          </div>
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
    </NewOrdersStyled>
  );
};

export default NewOrders;

const NewOrdersStyled = styled.div`
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
  .approve-btn {
    background: #4caf50;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    padding: 5px 10px;
    margin-right: 5px;
  }
  .reject-btn {
    background: #ff4d4d;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    padding: 5px 10px;
  }
  .view-icon {
    color: #333;
    font-size: 18px;
    cursor: pointer;
  }
  .view-all-btn {
    background: #001f3f;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
  }
  .button-center {
    display: flex;
    justify-content: center;
    align-items: center;
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
    box-shadow: 0 2px 16px rgba(0,0,0,0.2);
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    color: #888;
    cursor: pointer;
  }
`;
