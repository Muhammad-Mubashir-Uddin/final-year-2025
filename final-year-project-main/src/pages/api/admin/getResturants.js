// /src/pages/api/admin/getRestaurants.js
import dbConnect from "@/database/db";
import Restaurant from "@/database/models/Resturant";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { limit } = req.query; // Get the limit from query parameters
      const query = Restaurant.find({ status: "pending" });

      if (limit) {
        query.limit(parseInt(limit)).sort({ createdAt: -1 }); // Sort by creation date (descending) and limit
      }

      const restaurants = await query;
      return res.status(200).json(restaurants);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
