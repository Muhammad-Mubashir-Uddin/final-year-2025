import dbConnect from "@/database/db";
import Resturant from "@/database/models/Resturant";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const {
      name,
      email,
      phone,
      role,
      cnic,
      password,
      restaurantName,
      address,
      city,
      country,
      zipCode,
      mealType,
      facilities,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !role ||
      !cnic ||
      !password ||
      !restaurantName ||
      !address ||
      !city ||
      !country ||
      !zipCode ||
      !mealType ||
      facilities.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Convert mealType to an array by splitting the comma-separated string
      const mealTypeArray = mealType.split(",").map((type) => type.trim());

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the restaurant document
      const restaurant = new Resturant({
        user: {
          name,
          email,
          phone,
          role,
          cnic,
          password: hashedPassword,
        },
        restaurant: {
          name: restaurantName,
          address,
          city,
          country,
          zipCode,
          mealType: mealTypeArray,
          facilities,
        },
        status: "pending",
      });

      await restaurant.save();
      return res.status(201).json({
        message: "Restaurant registered successfully. Await admin approval.",
      });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists." });
      }
      return res
        .status(500)
        .json({ message: "Failed to register restaurant." });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed." });
  }
}
