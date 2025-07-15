import dbConnect from "@/database/db";
import User from "@/database/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const token = req.headers.authorization?.split(" ")[1]; // Authorization: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await dbConnect();
    const user = await User.findById(decoded.id).select("firstName email"); // Only return needed fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
