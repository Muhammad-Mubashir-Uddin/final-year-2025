import dbConnect from "@/database/db";
import User from "@/database/models/User";
import Resturant from "@/database/models/Resturant";
import { authenticate } from "@/database/utils/authUser";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await dbConnect();
    const user = authenticate(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { cartItems } = req.body;
    if (!cartItems?.length)
      return res.status(400).json({ message: "Cart is empty" });

    const orderNumber = "ORD-" + Date.now();
    const orderDate = new Date();

    const groupedByRestaurant = {};
    cartItems.forEach((item) => {
      if (!groupedByRestaurant[item.restaurantId]) {
        groupedByRestaurant[item.restaurantId] = [];
      }
      groupedByRestaurant[item.restaurantId].push(item);
    });

    for (const [restaurantId, items] of Object.entries(groupedByRestaurant)) {
      const totalAmount = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const restaurant = await Resturant.findById(restaurantId);
      if (!restaurant) continue;

      const userOrder = {
        orderNumber,
        restaurant: restaurant._id,
        items: items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        totalAmount,
        status: "pending",
        orderDate,
      };

      const restaurantOrder = {
        orderNumber,
        customer: {
          name: user.name,
          email: user.email,
          address: user.address,
        },
        items: userOrder.items,
        totalAmount,
        status: "pending",
        orderDate,
      };

      await User.findByIdAndUpdate(user._id, {
        $push: { orderHistory: userOrder },
      });
      restaurant.orders.push(restaurantOrder);
      restaurant.totalRevenue += totalAmount;
      restaurant.totalOrders += 1;
      await restaurant.save();
    }

    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
