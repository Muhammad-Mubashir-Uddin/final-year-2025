import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import styled from "styled-components";
import { useRouter } from "next/router";
import Modal from "react-modal";

const NewRestaurantRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const isDashboardPage = router.pathname === "/admin/dashboard";

  const fetchToken = () => {
    return localStorage.getItem("adminToken");
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `/api/admin/getResturants${isDashboardPage ? "?limit=2" : ""}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant requests.");
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching restaurant requests:", error.message);
      }
    };

    fetchRequests();
  }, [isDashboardPage]);

  const handleAction = async (restaurantId, action) => {
    const token = fetchToken();
    if (!token) {
      alert("Unauthorized: No token available.");
      return;
    }

    try {
      const response = await fetch("/api/admin/approval", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ restaurantId, action }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setRequests((prev) =>
          prev.filter((request) => request._id !== restaurantId)
        );
      } else {
        console.error(data.message || "Error processing the request.");
        alert(data.message || "Failed to process the request.");
      }
    } catch (error) {
      console.error("Error handling action:", error.message);
      alert("An error occurred while processing the request.");
    }
  };

  const openModal = async (restaurantId) => {
    try {
      const response = await fetch(
        `/api/admin/getRestaurantDetails?restaurantId=${restaurantId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch restaurant details.");
      }

      const data = await response.json();
      setSelectedRestaurant(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching restaurant details:", error.message);
      alert("An error occurred while fetching restaurant details.");
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  return (
    <RestaurantRequestsStyled>
      <div className="container">
        <h3>
          {isDashboardPage
            ? "Latest Restaurant Requests"
            : "New Restaurant Requests"}
        </h3>
        <table>
          <thead>
            <tr>
              <th>Request No</th>
              <th>Restaurant Name</th>
              <th>Owner / Manager Name</th>
              <th>Role</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request._id.slice(0, 5)}</td>
                <td>{request.restaurant.name}</td>
                <td>{request.user.name}</td>
                <td>{request.user.role}</td>
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleAction(request._id, "approve")}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleAction(request._id, "reject")}
                  >
                    Reject
                  </button>
                </td>
                <td>
                  <FaEye
                    className="view-icon"
                    onClick={() => openModal(request._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isDashboardPage && (
          <div className="button-center">
            <Link href="/admin/new-requests">
              <button className="view-all-btn">View All</button>
            </Link>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        {selectedRestaurant && (
          <div
            className="modalstyled"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              // width: "50%",
            }}
          >
            <h1
              style={{
                color: "#052855",
                marginTop: "30px",
                marginBottom: "40px",
              }}
            >
              Restaurant Details
            </h1>

            <h2 style={{ marginBottom: "10px", color: "#052855" }}>
              {selectedRestaurant.restaurant.name}
            </h2>
            <div style={{ width: "50%", marginTop: "30px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <p>
                  <strong>Owner:</strong> {selectedRestaurant.user.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedRestaurant.user.email}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <p>
                  <strong>Phone:</strong> {selectedRestaurant.user.phone}
                </p>
                <p>
                  <strong>Cnic:</strong>
                  {selectedRestaurant.user.cnic}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <p>
                  <strong>Role:</strong>
                  {selectedRestaurant.user.role}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedRestaurant.restaurant.address}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <p>
                  <strong>City:</strong> {selectedRestaurant.restaurant.city}
                </p>
                <p>
                  <strong>Country:</strong>{" "}
                  {selectedRestaurant.restaurant.country}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <p>
                  <strong>Zip Code:</strong>{" "}
                  {selectedRestaurant.restaurant.zipCode}
                </p>
                <p>
                  <strong>Facilities:</strong>{" "}
                  {selectedRestaurant.restaurant.facilities.join(", ")}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  className="approve-btn"
                  onClick={() =>
                    handleAction(selectedRestaurant._id, "approve")
                  }
                  style={{
                    background: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    padding: "5px 10px",
                    marginRight: "10px",
                  }}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(selectedRestaurant._id, "reject")}
                  style={{
                    background: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    padding: "5px 10px",
                    marginRight: "10px",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </RestaurantRequestsStyled>
  );
};

export default NewRestaurantRequests;

const RestaurantRequestsStyled = styled.div`
  
  
  
  
  
  
  .container {
    background: #fff;
    border-radius: 10px;
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
  .modalstyled {
    display: flex;
  }
`;
