// pages/api/user/orders/all.js
import dbConnect from "@/database/db";
import User from "@/database/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await dbConnect();

      const user = await User.findById(decoded.id).select(
        "firstName lastName email phoneNo address orderHistory"
      );

      if (!user) return res.status(404).json({ message: "User not found" });

      const detailedOrders = user.orderHistory.map((order) => ({
        orderId: order.orderId || undefined,
        orderNumber: order.orderNumber || undefined,
        orderDate: order.orderDate,
        totalPrice: order.totalPrice,
        status: order.status,
        orderType: order.orderType || undefined,
        restaurantId: order.restaurantId || undefined,
        restaurantName: order.restaurantName || undefined,
        customerName: order.customerName || `${user.firstName} ${user.lastName}`,
        customerEmail: order.customerEmail || user.email,
        customerPhone: order.customerPhone || user.phoneNo,
        customerAddress: order.customerAddress || user.address,
        items: order.items,
      }));

      return res.status(200).json({ orders: detailedOrders });
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  // Cancel order (DELETE)
  if (req.method === "DELETE") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "Order ID required" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await dbConnect();
      const user = await User.findById(decoded.id);
      if (!user) {
        console.error("User not found for cancel", decoded.id);
        return res.status(404).json({ message: "User not found" });
      }
      const order = user.orderHistory.find(o => o.orderId && o.orderId.toString() === orderId.toString());
      if (!order) {
        console.error("Order not found for cancel", orderId, user.orderHistory.map(o => o.orderId && o.orderId.toString()));
        return res.status(404).json({ message: "Order not found" });
      }
      if (order.status !== "pending") {
        console.error("Order not pending for cancel", order.status);
        return res.status(400).json({ message: "Only pending orders can be cancelled" });
      }
      order.status = "cancelled";
      await user.save();
      // Sync with restaurant order
      const Resturant = require("@/database/models/Resturant").default;
      const restaurant = await Resturant.findById(order.restaurantId);
      if (restaurant) {
        const restOrder = restaurant.restaurant.orders.find(o => o._id && o._id.toString() === orderId.toString());
        if (restOrder) {
          restOrder.status = "cancelled";
          await restaurant.save();
        } else {
          console.error("Restaurant order not found for cancel", orderId);
        }
      } else {
        console.error("Restaurant not found for cancel", order.restaurantId);
      }
      return res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
      console.error("Cancel order error", error);
      return res.status(500).json({ message: error.message || "Failed to cancel order" });
    }
  }

  // Edit order (PATCH)
  if (req.method === "PATCH") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const { orderId, items, address, phoneNo } = req.body;
    if (!orderId) return res.status(400).json({ message: "Order ID required" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await dbConnect();
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      const order = user.orderHistory.find(o => o.orderId && o.orderId.toString() === orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (!["pending", "accepted"].includes(order.status)) return res.status(400).json({ message: "Only pending or accepted orders can be edited" });
      if (items) order.items = items;
      if (address) user.address = address;
      if (phoneNo) user.phoneNo = phoneNo;
      // Recalculate total price
      if (items) order.totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      order.status = "pending";
      await user.save();
      // Sync with restaurant order
      const Resturant = require("@/database/models/Resturant").default;
      const restaurant = await Resturant.findById(order.restaurantId);
      if (restaurant) {
        const restOrder = restaurant.restaurant.orders.find(o => o._id && o._id.toString() === orderId);
        if (restOrder) {
          if (items) restOrder.items = items;
          if (address) restOrder.customer.address = address;
          if (phoneNo) restOrder.customer.phone = phoneNo;
          if (items) restOrder.totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          restOrder.status = "pending";
          await restaurant.save();
        }
      }
      return res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update order", error: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
