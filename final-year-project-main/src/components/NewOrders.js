import React from "react";
import styled from "styled-components";
import { FaEye } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";

const NewOrders = () => {
  const router = useRouter();

  const isDashboardPage = router.pathname === "/resturant/dashboard";

  return (
    <NewOrdersStyled>
      <div className="container">
        <h3>New Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Order Type</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#215r3</td>
              <td>Ali Salman</td>
              <td>Gulshan e abbas</td>
              <td>DineIn</td>
              <td>
                <button className="approve-btn">Accept</button>
                <button className="reject-btn">Reject</button>
              </td>
              <td>
                <FaEye className="view-icon" />
              </td>
            </tr>
            <tr>
              <td>#215r3</td>
              <td>Ali Salman</td>
              <td>Gulshan e abbas</td>
              <td>DineIn</td>
              <td>
                <button className="approve-btn">Accept</button>
                <button className="reject-btn">Reject</button>
              </td>
              <td>
                <FaEye className="view-icon" />
              </td>
            </tr>
          </tbody>
        </table>
        {isDashboardPage && (
          <div className="button-center">
            <Link href="/resturant/new-orders">
              <button className="view-all-btn">View All</button>
            </Link>
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
  .modalstyled {
    display: flex;
  }
`;
