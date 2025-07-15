import dbConnect from "@/database/db";
import Restaurant from "@/database/models/Resturant";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      // Get all restaurants with full info
      const restaurants = await Restaurant.find({}).sort({ createdAt: -1 });
      // Map to include completed orders count and menu availability breakdown
      const detailedRestaurants = restaurants.map((r) => {
        const menu = (r.restaurant.menu || []).map((item) => ({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          isAvailable: item.isAvailable,
        }));
        const availableItems = menu.filter((item) => item.isAvailable).length;
        const unavailableItems = menu.filter((item) => !item.isAvailable).length;
        const completedOrders = (r.restaurant.orders || []).filter((o) => o.status === "completed").length;
        return {
          _id: r._id,
          status: r.status,
          createdAt: r.createdAt,
          user: r.user,
          restaurant: {
            ...r.restaurant.toObject(),
            menu,
            availableItems,
            unavailableItems,
            completedOrders,
          },
        };
      });
      return res.status(200).json(detailedRestaurants);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch all restaurants" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
} 