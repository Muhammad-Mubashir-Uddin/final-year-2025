import dbConnect from "@/database/db";
import Resturant from "@/database/models/Resturant";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    // Auth required
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const restaurant = await Resturant.findById(decoded.id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      // Get only pending orders
      const pendingOrders = (restaurant.restaurant.orders || []).filter(
        (order) => order.status === "pending"
      );
      // Map to include orderType for frontend
      const orders = pendingOrders.map((order) => ({
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        address: order.customer.address,
        phone: order.customer.phone,
        email: order.customer.email,
        orderType: order.orderType || "N/A",
        status: order.status,
        items: order.items || [],
        totalPrice: order.totalPrice,
      }));
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  if (req.method === "PATCH") {
    // Auth required
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const restaurant = await Resturant.findById(decoded.id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      const { orderNumber, status } = req.body;
      if (!orderNumber || !["accepted", "rejected", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid order number or status" });
      }
      const order = restaurant.restaurant.orders.find(
        (o) => o.orderNumber === orderNumber
      );
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      order.status = status;
      if (status === "completed") {
        order.completionDate = new Date();
      }
      await restaurant.save();

      // Update user orderHistory status as well
      // Find the user by order.customer.email (assuming email is unique)
      const User = require("@/database/models/User").default || require("@/database/models/User");
      const userEmail = order.customer && order.customer.email;
      if (userEmail) {
        const user = await User.findOne({ email: userEmail });
        if (user && Array.isArray(user.orderHistory)) {
          // Try to match by orderId first, then fallback to orderNumber
          let userOrder = null;
          if (order._id) {
            userOrder = user.orderHistory.find((o) => o.orderId && o.orderId.toString() === order._id.toString());
          }
          if (!userOrder && order.orderNumber) {
            userOrder = user.orderHistory.find((o) => o.orderNumber === order.orderNumber);
          }
          if (userOrder) {
            userOrder.status = status;
            if (status === "completed") {
              userOrder.completionDate = order.completionDate;
            }
            await user.save();
          }
        }
      }
      return res.status(200).json({ message: `Order ${status}` });
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 