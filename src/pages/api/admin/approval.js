import dbConnect from "@/database/db";
import Restaurant from "@/database/models/Resturant";
import authenticateAdmin from "@/database/utils/authenticateAdmin";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    try {
      // Connect to the database
      await dbConnect();

      // Authenticate admin
      const admin = authenticateAdmin(req);
      if (!admin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get data from the request
      const { restaurantId, action } = req.body;

      // Validate inputs
      if (!restaurantId || !["approve", "reject"].includes(action)) {
        return res
          .status(400)
          .json({ message: "Invalid restaurantId or action" });
      }

      // Find the restaurant
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Update the restaurant status
      restaurant.status = action === "approve" ? "approved" : "rejected";
      await restaurant.save();

      return res
        .status(200)
        .json({ message: `Restaurant successfully ${action}d!` });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
