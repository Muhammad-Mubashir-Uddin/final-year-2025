import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const AdminLayout = ({ children }) => {
  const router = useRouter();

  // Sidebar navigation items
  const menuItems = [
    {
      name: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
      ),
      path: "/admin/dashboard",
    },
    {
      name: "New Requests",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
      ),
      path: "/admin/new-requests",
    },
    {
      name: "All Restaurants",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 6.75h15m-15 4.5h15m-15 4.5h15"
          />
        </svg>
      ),
      path: "/admin/all-restaurants",
    },
    {
      name: "Accepted Restaurants",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      path: "/admin/accepted-restaurants",
    },
    {
      name: "Rejected Restaurants",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      path: "/admin/rejected-restaurants",
    },
    {
      name: "Add Admin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
      path: "/admin/add-admin",
    },
    // Add remaining menu items here in the same format...
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Clear admin token
    router.push("/admin/login"); // Redirect to login page
  };

  return (
    <AdminLayoutStyled>
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={router.pathname === item.path ? "active" : ""}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
        <button className="logout" onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="icon-logout"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
          Log Out
        </button>
      </aside>
      <div className="section">
        <div className="header">
          <h1>
            {menuItems.find((item) => item.path === router.pathname)?.name ||
              "Dashboard"}
          </h1>
          <p>Hello, Admin</p>
        </div>
        <main className="main-content">{children}</main>
      </div>
    </AdminLayoutStyled>
  );
};

export default AdminLayout;

const AdminLayoutStyled = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f8fa;

  .sidebar {
    width: 18%;
    background-color: white;
    color: #052855;
    padding: 20px;
    margin: 15px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;

    h2 {
      font-size: 24px;
      margin-bottom: 30px;
      font-weight: 700;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 15px 0;
        padding: 10px 15px;
        cursor: pointer;
        border-radius: 10px;
        transition: all 0.3s ease;

        &:hover {
          background-color: #052855;
          color: white;
        }

        &.active {
          background-color: #052855;
          color: white;
          box-shadow: 0px 4px 10px rgba(0, 0, 255, 0.2);

          .icon {
            font-weight: bold;
          }

          span {
            font-weight: bold;
          }
        }

        .icon {
          width: 20px;
          height: 20px;
        }
      }
    }

    .logout {
      margin-top: auto;
      padding: 10px;
      background-color: #052855;
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #03407a;
        box-shadow: 0px 4px 10px rgba(0, 0, 255, 0.2);
      }

      .icon-logout {
        width: 18px;
        height: 18px;
      }
    }
  }

  .section {
    flex: 1;
    display: flex;
    flex-direction: column;

    .header {
      margin-top: 15px;
      background-color: white;
      border-radius: 30px;
      padding: 10px 30px;
      display: flex;
      align-items: center;
      margin-bottom: 0px;
      justify-content: space-between;
      margin-right: 15px;

      h1 {
        font-size: 20px;
        color: #052855;
      }
    }

    .main-content {
      padding: 20px;
      overflow-y: auto;
    }
  }
`;
