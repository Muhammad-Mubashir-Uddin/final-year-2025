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
      // Get only completed orders
      const completedOrders = (restaurant.restaurant.orders || []).filter(
        (order) => order.status === "completed"
      );
      // Map to include orderType for frontend
      const orders = completedOrders.map((order) => ({
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        address: order.customer.address,
        phone: order.customer.phone,
        email: order.customer.email,
        orderType: order.orderType || "N/A",
        status: order.status,
        items: order.items || [],
        totalPrice: order.totalPrice,
        completionDate: order.completionDate,
      }));
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 