// components/MyOrders.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/router";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return router.push("/users/login");

      try {
        const res = await axios.get("/api/user/lastOrders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);

  const last3Orders = orders.slice(-3).reverse();

  return (
    <MyOrdersStyled>
      <h2>My Recent Orders</h2>
      {last3Orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        last3Orders.map((order, index) => (
          <div className="order" key={index}>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
            </p>
            <p>
              <strong>Delivery Address:</strong> {order.customerAddress}
            </p>
          </div>
        ))
      )}
      <button onClick={() => router.push("/users/orders")}>
        View All Order Details
      </button>
    </MyOrdersStyled>
  );
};

export default MyOrders;

const MyOrdersStyled = styled.div`
  background: #fff;
  border-radius: 16px;
  // box-shadow: 0 2px 12px rgba(5,40,85,0.10);
  padding: 28px 16px 18px 16px;
  // max-width: 400px;
  margin: 0 auto;
  font-family: poppins;
  h2 {
    color: #052855;
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 18px;
    text-align: center;
    font-family: poppins;
  }
  .order {
    border: 1px solid #e3e9f6;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 12px;
    background: #f5f8fa;
    box-shadow: 0 1px 4px rgba(5,40,85,0.04);
    position: relative;
    font-family: poppins;
  }
  button {
    background: #052855;
    color: white;
    border: none;
    padding: 14px 0;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    margin-top: 15px;
    font-size: 1.1rem;
    transition: background 0.2s;
    font-family: poppins;
    &:hover {
      background: #034074;
    }
  }
`;

// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import axios from "axios";
// import { useRouter } from "next/router";

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("/api/user/lastOrders", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setOrders(res.data.orders || []);
//       } catch (error) {
//         console.error("Failed to fetch last three orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <OrdersStyled>Loading...</OrdersStyled>;

//   return (
//     <OrdersStyled>
//       <h3>Orders</h3>
//       {orders.length === 0 ? (
//         <p className="no-orders">No orders yet.</p>
//       ) : (
//         <>
//           <table>
//             <thead>
//               <tr>
//                 <th>Order No</th>
//                 <th>Order Date</th>
//                 <th>Price</th>
//                 <th>Status</th>
//                 <th>Address</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order, i) => (
//                 <tr key={i}>
//                   <td>{order.orderId || `00${i + 1}`}</td>
//                   <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                   <td>${order.totalPrice}</td>
//                   <td>
//                     <span className={`status ${order.status}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td>{order.customerAddress || "N/A"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="button-wrapper">
//             <button onClick={() => router.push("/users/orders")}>
//               View All Orders Details
//             </button>
//           </div>
//         </>
//       )}
//     </OrdersStyled>
//   );
// };

// export default MyOrders;

// const OrdersStyled = styled.div`
//   padding: 20px;

//   h3 {
//     margin-bottom: 20px;
//   }

//   .no-orders {
//     font-style: italic;
//     color: #999;
//   }

//   table {
//     width: 100%;
//     border-collapse: collapse;
//     text-align: left;
//     margin-bottom: 20px;
//   }

//   th,
//   td {
//     padding: 10px;
//     border-bottom: 1px dashed #ccc;
//   }

//   .status.completed {
//     background: #28c76f;
//     color: white;
//     padding: 2px 10px;
//     border-radius: 5px;
//   }

//   .status.rejected,
//   .status.canceled {
//     background: #ea5455;
//     color: white;
//     padding: 2px 10px;
//     border-radius: 5px;
//   }

//   .status.pending {
//     background: #ffc107;
//     color: white;
//     padding: 2px 10px;
//     border-radius: 5px;
//   }

//   .button-wrapper {
//     display: flex;
//     justify-content: center;

//     button {
//       padding: 10px 20px;
//       background: #052855;
//       color: white;
//       border: none;
//       border-radius: 6px;
//       cursor: pointer;
//     }
//   }
// `;
