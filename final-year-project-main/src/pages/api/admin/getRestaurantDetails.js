import dbConnect from "@/database/db";
import Restaurant from "@/database/models/Resturant";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    try {
      const restaurant = await Restaurant.findById(restaurantId).select(
        "user restaurant.name restaurant.address restaurant.city restaurant.country restaurant.zipCode restaurant.facilities"
      );

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      return res.status(200).json(restaurant);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching restaurant details" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
