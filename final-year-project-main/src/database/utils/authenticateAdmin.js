// /src/utils/authenticateAdmin.js
import jwt from "jsonwebtoken";

const authenticateAdmin = (req) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    return decoded;
  } catch (error) {
    throw new Error("Unauthorized: Invalid token");
  }
};

export default authenticateAdmin;
