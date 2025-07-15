// pages/api/restaurants/all.js
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
    const currentTime = now.toTimeString().slice(0, 5);

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

    const processed = restaurants.map((r) => {
      const availableMenuCount = r.restaurant.menu.filter(
        (item) => item.isAvailable
      ).length;
      const ratings = r.restaurant.reviews.map((r) => r.rating || 0);
      const avgRating = ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

      return {
        _id: r._id,
        name: r.restaurant.name,
        address: r.restaurant.address,
        city: r.restaurant.city,
        avgRating,
        availableMenuCount,
      };
    });

    return res.status(200).json({ restaurants: processed });
  } catch (err) {
    return res.status(401).json({ message: err.message || "Unauthorized" });
  }
}
