import dbConnect from "@/database/db";
import Resturant from "@/database/models/Resturant";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verify the token
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the restaurant details using the decoded ID
      const restaurant = await Resturant.findById(decoded.id);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Return the restaurant data
      return res.status(200).json({ message: "Success", restaurant });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching profile data" });
    }
  } else if (req.method === "PUT") {
    const { authorization } = req.headers;
    const {
      name,
      address,
      city,
      country,
      zipCode,
      mealType,
      facilities,
      timings,
    } = req.body;

    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Verify the token
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the restaurant details using the decoded ID
      const restaurant = await Resturant.findById(decoded.id);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Update the restaurant details
      if (name) restaurant.restaurant.name = name;
      if (address) restaurant.restaurant.address = address;
      if (city) restaurant.restaurant.city = city;
      if (country) restaurant.restaurant.country = country;
      if (zipCode) restaurant.restaurant.zipCode = zipCode;
      if (mealType)
        restaurant.restaurant.mealType = mealType
          .split(",")
          .map((type) => type.trim());
      if (facilities)
        restaurant.restaurant.facilities = Array.isArray(facilities)
          ? facilities
          : [];
      if (timings) restaurant.restaurant.timings = timings;

      await restaurant.save();

      return res
        .status(200)
        .json({ message: "Profile updated successfully", restaurant });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating profile data" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
