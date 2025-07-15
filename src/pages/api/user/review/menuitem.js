import dbConnect from "@/database/db";
import Restaurant from "@/database/models/Resturant";
import User from "@/database/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { restaurantId, menuItemId, rating, comment } = req.body;
    if (!restaurantId || !menuItemId || !rating) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const menu = restaurant.restaurant.menu || [];
    const menuItem = menu.find(item => item._id.toString() === menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    // Remove old review if exists
    menuItem.reviews = (menuItem.reviews || []).filter(r => r.userId.toString() !== userId);
    // Add new review
    const review = {
      userId,
      name: decoded.firstName || "User",
      rating,
      comment,
      createdAt: new Date(),
    };
    menuItem.reviews.push(review);
    await restaurant.save();
    // Also add to user model
    const user = await User.findById(userId);
    if (user) {
      user.reviews = (user.reviews || []).filter(r => r.menuItemId?.toString() !== menuItemId);
      user.reviews.push({
        restaurantId,
        menuItemId,
        rating,
        comment,
        createdAt: new Date(),
      });
      await user.save();
    }
    return res.status(200).json({ reviews: menuItem.reviews });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
} 