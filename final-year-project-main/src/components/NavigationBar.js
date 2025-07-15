import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const NavigationBar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      try {
        const response = await axios.get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("User fetch failed:", error);
        localStorage.removeItem("userToken");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUser(null);
    router.push("/users/login");
  };

  return (
    <NavigationBarStyled>
      <div className="navigation-back">
        <div className="logo">
          <h2>Food Hunt</h2>
        </div>
        <div className="tabs">
          {user ? (
            <div className="with-login">
              <Link href="/users/home">Home</Link>
              <Link href="/users/profile">Profile</Link>

              <span>Hello, {user.firstName}</span>
              <Link href="/users/cart">
                <CartIcon />
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="without-login">
              <Link href="/users/login">Login</Link>
              <Link href="/users/register">
                <button>Sign Up</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </NavigationBarStyled>
  );
};

export default NavigationBar;

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="cart-icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 
       1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 
       1.125 0 0 1-1.12-1.243l1.264-12A1.125 
       1.125 0 0 1 5.513 7.5h12.974c.576 
       0 1.059.435 1.119 1.007ZM8.625 
       10.5a.375.375 0 1 1-.75 0 
       .375.375 0 0 1 .75 0Zm7.5 
       0a.375.375 0 1 1-.75 0 
       .375.375 0 0 1 .75 0Z"
    />
  </svg>
);

const NavigationBarStyled = styled.div`
  color: white;
  width: 90%;
  margin: 1% 5%;
  position: fixed;
  z-index: 10;
  .navigation-back {
    border-radius: 20px;
    background-color: #052855;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 255, 0.2);
  }
  .logo h2 {
    font-size: 24px;
    font-weight: bold;
  }

  .tabs {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-right: 30px;
  }

  .with-login,
  .without-login {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .with-login span {
    font-weight: 500;
  }

  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
  }

  a:hover {
    color: #ffcc00;
  }

  button {
    background-color: #ffffff;
    color: #052855;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }

  button:hover {
    background-color: #ffcc00;
    color: #052855;
  }

  .cart-icon {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    .navigation-back {
      flex-direction: column;
      gap: 10px;
    }

    .tabs {
      justify-content: center;
    }
  }
`;
