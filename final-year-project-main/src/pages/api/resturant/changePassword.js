import dbConnect from "@/database/db";
import Restaurant from "@/database/models/Resturant";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { authorization } = req.headers;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verify the token
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the restaurant and ensure we select the password field
      const restaurant = await Restaurant.findById(decoded.id).select(
        "user.password"
      );

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (!restaurant.user || !restaurant.user.password) {
        return res
          .status(500)
          .json({ message: "Password not found in database" });
      }

      // Validate inputs
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      // Check if current password is correct
      const isMatch = await bcrypt.compare(
        currentPassword,
        restaurant.user.password
      );
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      restaurant.user.password = hashedPassword;
      await restaurant.save();

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating password" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
