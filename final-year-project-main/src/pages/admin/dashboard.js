import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout"; // Adjust the import path as necessary
import styled from "styled-components";
import SummaryCard from "@/components/SummaryCard";
import RevenueChart from "@/components/RevenueChart";
import TotalOrders from "@/components/TotalOrders";
import NewRequests from "./new-requests";
import NewRestaurantRequests from "@/components/NewRestaurantRequests";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if admin token exists, if not redirect to login page
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login"); // Redirect to login page if no token
      return;
    }

    // Fetch all pending restaurants
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("/api/admin/getResturants", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in header
          },
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error("Failed to fetch restaurants", error);
      }
    };

    fetchRestaurants();
  }, [router]);

  const handleApproval = async (restaurantId, action) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("You need to be logged in to approve/reject a restaurant!");
      return;
    }

    try {
      const response = await axios.patch(
        "/api/admin/approval",
        { restaurantId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      setRestaurants((prev) =>
        prev.filter((restaurant) => restaurant._id !== restaurantId)
      );
    } catch (error) {
      console.error("Failed to update restaurant status", error);
      alert("Failed to update restaurant status");
    }
  };

  const CardData = [
    {
      id: 1,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
      Name: "Revenue Generated",
      numbers: "$80,000",
    },
    {
      id: 2,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
          />
        </svg>
      ),
      Name: "Orders Fulfilled",
      numbers: "800",
    },
    {
      id: 3,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
      Name: "Total Users",
      numbers: "900",
    },
    {
      id: 4,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
          />
        </svg>
      ),
      Name: "Total Restaurants",
      numbers: "100",
    },
  ];

  return (
    <AdminLayout>
      <AdminDashboardStyled>
        <div className="summary">
          {CardData.map((data) => {
            return (
              <div className="data" key={data.id}>
                <SummaryCard
                  icon={data.icon}
                  name={data.Name}
                  numbers={data.numbers}
                />
              </div>
            );
          })}
        </div>
        <div className="charts">
          <RevenueChart />
          <TotalOrders />
        </div>
        <NewRestaurantRequests />
      </AdminDashboardStyled>
    </AdminLayout>
  );
};

export default AdminDashboard;

const AdminDashboardStyled = styled.div`
  width: 100%;
  .summary {
    width: 98%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    /* flex-wrap: wrap; */
    .data {
      width: 50%;
      margin: 0 10px;
    }
  }
  .charts {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-top: 20px;
  }
`;
