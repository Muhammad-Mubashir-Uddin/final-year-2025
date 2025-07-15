// lib/auth.js
import jwt from "jsonwebtoken";

export function authenticate(req) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");

  return jwt.verify(token, process.env.JWT_SECRET);
}
