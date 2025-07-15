import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaEye } from "react-icons/fa";
import Modal from "react-modal";
import AdminLayout from "@/components/AdminLayout";

const API_URL = "/api/admin/acceptedResturants";

export default function AcceptedRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch restaurants.");
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        alert(error.message || "Error fetching restaurants.");
      }
    };
    fetchRestaurants();
  }, []);

  const openModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  return (
    <AdminLayout>
      <AllRestaurantsStyled>
        <div className="container">
          <h3>Accepted Restaurants</h3>
          <table>
            <thead>
              <tr>
                <th>Restaurant ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id}>
                  <td>{restaurant._id.slice(0, 5)}</td>
                  <td>{restaurant.restaurant?.name || "-"}</td>
                  <td>{restaurant.restaurant?.city || "-"}</td>
                  <td>{restaurant.status || "-"}</td>
                  <td>
                    <FaEye
                      className="view-icon"
                      onClick={() => openModal(restaurant)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
          {selectedRestaurant && (
            <div className="modalstyled" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
              <h1 style={{ color: "#052855", marginTop: "30px", marginBottom: "20px" }}>Restaurant Details</h1>
              <h2 style={{ marginBottom: "10px", color: "#052855" }}>{selectedRestaurant.restaurant?.name}</h2>
              {/* Owner/Manager Info */}
              <div style={{ width: "80%", margin: "10px auto", background: "#f5f8fa", borderRadius: 8, padding: 16 }}>
                <h3 style={{ color: "#052855", marginBottom: 8 }}>Owner / Manager Info</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p><strong>Name:</strong> {selectedRestaurant.user?.name}</p>
                  <p><strong>Email:</strong> {selectedRestaurant.user?.email}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p><strong>Phone:</strong> {selectedRestaurant.user?.phone}</p>
                  <p><strong>Role:</strong> {selectedRestaurant.user?.role}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p><strong>CNIC:</strong> {selectedRestaurant.user?.cnic}</p>
                </div>
              </div>
              {/* Restaurant Info */}
              <div style={{ width: "80%", margin: "10px auto", background: "#f5f8fa", borderRadius: 8, padding: 16 }}>
                <h3 style={{ color: "#052855", marginBottom: 8 }}>Restaurant Info</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p><strong>City:</strong> {selectedRestaurant.restaurant?.city}</p>
                  <p><strong>Address:</strong> {selectedRestaurant.restaurant?.address}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p><strong>Status:</strong> {selectedRestaurant.status}</p>
                  <p><strong>Country:</strong> {selectedRestaurant.restaurant?.country}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p><strong>Zip Code:</strong> {selectedRestaurant.restaurant?.zipCode}</p>
                  <p><strong>Created At:</strong> {selectedRestaurant.createdAt ? new Date(selectedRestaurant.createdAt).toLocaleString() : "-"}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p><strong>Meal Types:</strong> {selectedRestaurant.restaurant?.mealType?.join(", ")}</p>
                  <p><strong>Facilities:</strong> {selectedRestaurant.restaurant?.facilities?.join(", ")}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p><strong>Total Orders:</strong> {selectedRestaurant.restaurant?.totalOrders}</p>
                  <p><strong>Completed Orders:</strong> {selectedRestaurant.restaurant?.completedOrders ?? selectedRestaurant.restaurant?.totalCompletedOrders ?? 0}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <p><strong>Available Menu Items:</strong> {selectedRestaurant.restaurant?.availableItems}</p>
                  <p><strong>Unavailable Menu Items:</strong> {selectedRestaurant.restaurant?.unavailableItems}</p>
                </div>
              </div>
              {/* Menu Info */}
              <div style={{ width: "80%", margin: "10px auto", background: "#f5f8fa", borderRadius: 8, padding: 16 }}>
                <h3 style={{ color: "#052855", marginBottom: 8 }}>Menu</h3>
                {selectedRestaurant.restaurant?.menu?.length > 0 ? (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: 4 }}>Name</th>
                        <th style={{ textAlign: "left", padding: 4 }}>Category</th>
                        <th style={{ textAlign: "left", padding: 4 }}>Price</th>
                        <th style={{ textAlign: "left", padding: 4 }}>Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRestaurant.restaurant.menu.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: 4 }}>{item.name}</td>
                          <td style={{ padding: 4 }}>{item.category}</td>
                          <td style={{ padding: 4 }}>Rs. {item.price}</td>
                          <td style={{ padding: 4 }}>{item.isAvailable ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No menu items found.</p>
                )}
              </div>
            </div>
          )}
        </Modal>
      </AllRestaurantsStyled>
    </AdminLayout>
  );
}

const AllRestaurantsStyled = styled.div`
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
`; 