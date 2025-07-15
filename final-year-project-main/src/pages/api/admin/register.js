import dbConnect from "@/database/db";
import Admin from "@/database/models/Admin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    await dbConnect();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    const admin = new Admin({ email, password });
    await admin.save();

    return res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong.", error });
  }
}
