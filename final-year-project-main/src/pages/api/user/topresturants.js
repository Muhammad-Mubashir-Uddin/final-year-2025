// pages/api/restaurants/top.js
import dbConnect from "@/database/db";
import Resturant from "@/database/models/Resturant";
import { authenticate } from "@/database/utils/authUser";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  await dbConnect();

  try {
    authenticate(req); // 🔐 Ensure user is logged in

    const now = new Date();
    const currentDay = now.toLocaleString("en-US", { weekday: "long" });
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const restaurants = await Resturant.find({
      "restaurant.mealTimings": {
        $elemMatch: {
          day: currentDay,
          startTime: { $lte: currentTime },
          endTime: { $gte: currentTime },
        },
      },
      "restaurant.menu.isAvailable": true,
      "restaurant.menu.0": { $exists: true },
    })
      .select(
        "restaurant.name restaurant.city restaurant.address restaurant.menu restaurant.reviews"
      )
      .lean();

    // Optional: Sort by avg rating or completed orders (example by avg rating)
    const sorted = restaurants
      .map((r) => {
        const ratings = r.restaurant.reviews.map((r) => r.rating || 0);
        const avgRating = ratings.length
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
        return { ...r, avgRating };
      })
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 7);

    return res.status(200).json({ restaurants: sorted });
  } catch (err) {
    return res.status(401).json({ message: err.message || "Unauthorized" });
  }
}
