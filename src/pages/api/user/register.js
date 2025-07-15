import dbConnect from "@/database/db";
import User from "@/database/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      phoneNo,
      address,
      password,
      confirmPassword,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNo ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate phone number format
    if (!/^[0-9]{11}$/.test(phoneNo)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 11 digits." });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user document
      const user = new User({
        firstName,
        lastName,
        email,
        phoneNo,
        address,
        password: hashedPassword,
      });

      await user.save();

      return res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to register user." });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed." });
  }
}
