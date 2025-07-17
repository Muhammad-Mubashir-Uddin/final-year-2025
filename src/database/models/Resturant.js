import mongoose from "mongoose";

// Extra options for menu items
const ExtraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
});

// Meal schedule
const MealTimingSchema = new mongoose.Schema({
  mealType: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

// Review schema (shared by dish and restaurant)
const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true }, // user name
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Menu item
const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: String,
  extras: [ExtraSchema],
  isAvailable: { type: Boolean, default: true },
  reviews: [ReviewSchema], // 👈 Dish-level reviews
});

// Order schema
const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending",
  },
  reason: String,
  orderDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  totalPrice: { type: Number, required: true },
  orderType: {
    type: String,
    enum: ["dineIn", "pickUp", "delivery", "reservations"],
    // not required, frontend will validate
  },
});

// Restaurant schema
const RestaurantSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["manager", "owner"], required: true },
    cnic: { type: String, required: true },
    password: { type: String, required: true },
  },
  restaurant: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    mealType: { type: [String], required: true },
    mealTimings: [MealTimingSchema],
    joinDate: { type: Date, default: Date.now },
    facilities: [
      { type: String, enum: ["dineIn", "pickUp", "delivery", "reservations"] },
    ],
    menu: [MenuItemSchema],
    orders: [OrderSchema],
    reviews: [ReviewSchema], // 👈 Restaurant-level reviews
    totalRevenue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalCompletedOrders: { type: Number, default: 0 },
    totalCustomers: { type: Number, default: 0 },
    customers: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        joinDate: { type: Date, default: Date.now },
      },
    ],
    seatsAvailable: {
      dineIn: { type: Number, default: 0 },
      reservations: { type: Number, default: 0 },
    },
    revenueByDay: { type: Map, of: Number, default: {} },
    revenueByWeek: { type: Map, of: Number, default: {} },
    revenueByMonth: { type: Map, of: Number, default: {} },
    revenueByYear: { type: Map, of: Number, default: {} },
  },
  status: { type: String, default: "pending" },
});

export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", RestaurantSchema);
