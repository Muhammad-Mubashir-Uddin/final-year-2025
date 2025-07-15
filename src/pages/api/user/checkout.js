import dbConnect from "@/database/db";
import User from "@/database/models/User";
import Resturant from "@/database/models/Resturant";
import { authenticate } from "@/database/utils/authUser";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await dbConnect();
    const decoded = authenticate(req);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { cartItems, userInfo, orderType } = req.body;
    if (!cartItems?.length)
      return res.status(400).json({ message: "Cart is empty" });

    // Update user main info if changed
    let userUpdated = false;
    if (userInfo?.phoneNo && user.phoneNo !== userInfo.phoneNo) {
      user.phoneNo = userInfo.phoneNo;
      userUpdated = true;
    }
    if (userInfo?.address && user.address !== userInfo.address) {
      user.address = userInfo.address;
      userUpdated = true;
    }
    if (userInfo?.firstName && user.firstName !== userInfo.firstName) {
      user.firstName = userInfo.firstName;
      userUpdated = true;
    }
    if (userInfo?.lastName && user.lastName !== userInfo.lastName) {
      user.lastName = userInfo.lastName;
      userUpdated = true;
    }
    if (userInfo?.email && user.email !== userInfo.email) {
      user.email = userInfo.email;
      userUpdated = true;
    }

    // Use userInfo from request if provided, else fallback to user
    const customerInfo = {
      firstName: userInfo?.firstName || user.firstName,
      lastName: userInfo?.lastName || user.lastName,
      email: userInfo?.email || user.email,
      phoneNo: userInfo?.phoneNo || user.phoneNo,
      address: userInfo?.address || user.address,
    };

    // Validate required fields
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phoneNo || !customerInfo.address) {
      return res.status(400).json({ message: "Please provide all required user info fields." });
    }

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
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        console.error('Invalid restaurantId:', restaurantId);
        continue;
      }
      const totalPrice = items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const restaurant = await Resturant.findById(restaurantId);
      if (!restaurant) continue;

      // Generate a new ObjectId for orderId
      const orderId = new mongoose.Types.ObjectId();

      // User order (orderHistory)
      const userOrder = {
        restaurantId: restaurant._id,
        orderId,
        orderNumber,
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        totalPrice,
        orderDate,
        status: "pending",
        orderType: orderType || "dineIn",
      };

      // Restaurant order (orders array)
      const restaurantOrder = {
        _id: orderId,
        orderNumber,
        customer: {
          name: customerInfo.firstName + " " + customerInfo.lastName,
          phone: customerInfo.phoneNo,
          email: customerInfo.email,
          address: customerInfo.address,
        },
        items: items.map((i) => ({
          menuItemId: i.menuItemId ? i.menuItemId : undefined,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        totalPrice,
        status: "pending",
        orderDate,
        orderType: orderType || "dineIn",
      };

      user.orderHistory.push(userOrder);
      if (userUpdated) await user.save();
      else await user.save();
      restaurant.restaurant.orders.push(restaurantOrder);
      restaurant.restaurant.totalRevenue += totalPrice;
      restaurant.restaurant.totalOrders += 1;
      await restaurant.save();
    }

    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
