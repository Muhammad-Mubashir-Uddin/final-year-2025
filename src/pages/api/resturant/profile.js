import dbConnect from "@/database/db";
import Resturant from "@/database/models/Resturant";
import jwt from "jsonwebtoken";
import { formidable } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const PROFILE_DIR = path.join(process.cwd(), "public/assests/restaurants");

async function handleImageUpload(req, res, restaurant) {
  // Ensure directory exists
  if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });
  const form = formidable({ uploadDir: PROFILE_DIR, keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Upload error" });
    const file = files.image;
    if (!file) return res.status(400).json({ message: "No image uploaded" });
    // Unique filename
    let ext = '';
    if (file.originalFilename) ext = path.extname(file.originalFilename);
    else if (file.newFilename) ext = path.extname(file.newFilename);
    if (!ext) ext = '.jpg';
    const filename = `rest_${restaurant._id}_${Date.now()}${ext}`;
    const dest = path.join(PROFILE_DIR, filename);
    // Get the file path robustly
    const filePath = file.filepath || file.path || (file._writeStream && file._writeStream.path);
    if (!filePath) return res.status(400).json({ message: "File path not found in upload" });
    fs.renameSync(filePath, dest);
    // Save URL in DB
    restaurant.restaurant.profileImage = `/assests/restaurants/${filename}`;
    await restaurant.save();
    return res.status(200).json({ profileImage: restaurant.restaurant.profileImage });
  });
}

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    // Auth required
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    try {
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const restaurant = await Resturant.findById(decoded.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      return res.status(200).json({ restaurant });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching profile data" });
    }
  }
  if (req.method === "POST") {
    // Auth required
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
    try {
      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const restaurant = await Resturant.findById(decoded.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      return handleImageUpload(req, res, restaurant);
    } catch (error) {
      return res.status(500).json({ message: "Error uploading profile image" });
    }
  }
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
