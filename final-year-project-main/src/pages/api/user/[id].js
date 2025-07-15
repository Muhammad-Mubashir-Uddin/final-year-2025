import dbConnect from "@/database/db";
import Resturant from "@/database/models/Resturant";
import { authenticate } from "@/database/utils/authUser";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  await dbConnect();

  try {
    authenticate(req); // 🔐 Ensure user is logged in

    const { id } = req.query;
    const restaurant = await Resturant.findById(id).lean();

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const menuAvailable = restaurant.restaurant.menu.filter(
      (item) => item.isAvailable
    );

    // ✅ Flatten response and include _id
    return res.status(200).json({
      restaurant: {
        _id: restaurant._id,
        ...restaurant.restaurant,
        menu: menuAvailable,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: err.message || "Unauthorized" });
  }
}
