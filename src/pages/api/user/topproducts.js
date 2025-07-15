import dbConnect from "@/database/db";
import Restaurant from "@/database/models/Resturant";
import { authenticate } from "@/database/utils/authUser";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  await dbConnect();

  try {
    authenticate(req); // Ensure user is logged in

    // Get all restaurants with available menu items
    const restaurants = await Restaurant.find({
      "restaurant.menu.isAvailable": true,
      "restaurant.menu.0": { $exists: true },
    })
      .select("restaurant.name restaurant.menu restaurant.city")
      .lean();

    // Flatten all available menu items with their restaurant info
    let allMenuItems = [];
    restaurants.forEach((r) => {
      (r.restaurant.menu || []).forEach((item) => {
        if (item.isAvailable) {
          const ratings = (item.reviews || []).map((rev) => rev.rating || 0);
          const avgRating = ratings.length
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
          allMenuItems.push({
            _id: item._id,
            name: item.name,
            price: item.price,
            image: item.image || null,
            restaurantName: r.restaurant.name,
            city: r.restaurant.city,
            avgRating,
            reviewCount: ratings.length,
          });
        }
      });
    });

    // Sort by avgRating, then by reviewCount, then by name
    allMenuItems = allMenuItems
      .filter((item) => item.avgRating > 0)
      .sort((a, b) =>
        b.avgRating !== a.avgRating
          ? b.avgRating - a.avgRating
          : b.reviewCount !== a.reviewCount
          ? b.reviewCount - a.reviewCount
          : a.name.localeCompare(b.name)
      )
      .slice(0, 10);

    return res.status(200).json({ products: allMenuItems });
  } catch (err) {
    return res.status(401).json({ message: err.message || "Unauthorized" });
  }
} 