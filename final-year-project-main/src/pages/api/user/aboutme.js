// /api/user/me.js
import dbConnect from "@/database/db";
import User from "@/database/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    await dbConnect();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
// This API endpoint retrieves the user's profile information based on the JWT token provided in the request headers.