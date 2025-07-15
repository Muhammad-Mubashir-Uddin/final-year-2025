import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, match: /^[0-9]{11}$/ },
    address: { type: String, required: true },
    password: { type: String, required: true },
    orderHistory: [
      {
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
        },
        orderId: { type: mongoose.Schema.Types.ObjectId },
        items: [
          {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
          },
        ],
        totalPrice: { type: Number, required: true },
        orderDate: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected", "completed"],
          default: "pending",
        },
      },
    ],
    reviews: [
      {
        reviewId: { type: mongoose.Schema.Types.ObjectId }, // optional for deletion/editing tracking
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
        },
        menuItemId: { type: mongoose.Schema.Types.ObjectId }, // optional for dish-specific reviews
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
