import dbConnect from "@/database/db";
import Resturant from "@/database/models/Resturant";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Find the restaurant by email in the `user` object
      const restaurant = await Resturant.findOne({ "user.email": email });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, restaurant.user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check if the restaurant is approved
      if (restaurant.status !== "approved") {
        return res.status(400).json({ message: "Restaurant not approved yet" });
      }

      // Generate a JWT token with the restaurant's ID
      const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error logging in restaurant" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
