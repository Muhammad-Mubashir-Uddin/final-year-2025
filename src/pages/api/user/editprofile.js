// pages/api/user/update.js
import dbConnect from "@/database/db";
import User from "@/database/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  await dbConnect();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const updates = req.body;
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
