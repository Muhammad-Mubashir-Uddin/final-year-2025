import dbConnect from "@/database/db";
import Resturant from "@/database/models/Resturant";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") return getMenu(req, res);
    if (req.method === "POST") return addMenuItem(req, res);
    if (req.method === "PUT") return updateMenuItem(req, res);
    if (req.method === "PATCH") return toggleAvailability(req, res);
    if (req.method === "DELETE") return deleteMenuItem(req, res);

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

// 🔹 Authenticate User
async function authenticate(req) {
  const { authorization } = req.headers;
  if (!authorization) throw new Error("Unauthorized");

  const token = authorization.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

// 🔹 Get menu items
async function getMenu(req, res) {
  try {
    const decoded = await authenticate(req);
    const restaurant = await Resturant.findById(decoded.id).select(
      "restaurant.menu"
    );

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    return res
      .status(200)
      .json(
        Array.isArray(restaurant.restaurant.menu)
          ? restaurant.restaurant.menu
          : []
      );
  } catch (error) {
    return res
      .status(401)
      .json({ message: error.message || "Error fetching menu" });
  }
}

// 🔹 Add menu item
async function addMenuItem(req, res) {
  try {
    const { authorization } = req.headers;
    const { name, description, price, category, image, extras, isAvailable } =
      req.body;

    if (!authorization)
      return res.status(401).json({ message: "Unauthorized" });

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const restaurant = await Resturant.findById(decoded.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    // Initialize menu if it doesn't exist
    if (!restaurant.restaurant.menu) {
      restaurant.restaurant.menu = [];
    }

    const newItem = {
      name,
      description,
      price,
      category,
      image,
      extras: extras || [],
      isAvailable: isAvailable ?? true,
    };

    restaurant.restaurant.menu.push(newItem);
    await restaurant.save();

    return res
      .status(201)
      .json({ message: "Menu item added", menu: restaurant.restaurant.menu });
  } catch (error) {
    console.error("Error adding menu item:", error);
    return res.status(500).json({ message: "Error adding menu item" });
  }
}

// 🔹 Update menu item
async function updateMenuItem(req, res) {
  try {
    const decoded = await authenticate(req);
    const restaurant = await Resturant.findById(decoded.id);

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const {
      itemId,
      name,
      description,
      price,
      category,
      image,
      extras,
      isAvailable,
    } = req.body;
    const menuItem = restaurant.restaurant.menu.id(itemId);

    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = price;
    if (category) menuItem.category = category;
    if (image) menuItem.image = image;
    if (extras) menuItem.extras = extras;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

    await restaurant.save();
    return res
      .status(200)
      .json({ message: "Menu item updated", menu: restaurant.restaurant.menu });
  } catch (error) {
    return res.status(500).json({ message: "Error updating menu item" });
  }
}

// 🔹 Toggle availability
async function toggleAvailability(req, res) {
  try {
    const decoded = await authenticate(req);
    const restaurant = await Resturant.findById(decoded.id);

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const { itemId } = req.body;
    const menuItem = restaurant.restaurant.menu.id(itemId);

    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    menuItem.isAvailable = !menuItem.isAvailable;
    await restaurant.save();

    return res.status(200).json({
      message: "Availability toggled",
      menu: restaurant.restaurant.menu,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error toggling availability" });
  }
}

// 🔹 Delete menu item
async function deleteMenuItem(req, res) {
  try {
    const decoded = await authenticate(req);
    const restaurant = await Resturant.findById(decoded.id);

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const { itemId } = req.body;
    const menuItem = restaurant.restaurant.menu.id(itemId);

    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    restaurant.restaurant.menu.pull({ _id: itemId });
    await restaurant.save();

    return res
      .status(200)
      .json({ message: "Menu item deleted", menu: restaurant.restaurant.menu });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting menu item" });
  }
}
