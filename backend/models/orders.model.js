import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      name: String, // snapshot of item name at order time
      quantity: Number,
      price: Number, // price at time of order
      customizations: [
        {
          name: String,
          option: String,
          extraCost: Number,
        },
      ],
    },
  ],
  subtotal: Number,
  tax: Number,
  deliveryFee: Number,
  total: Number,
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  paymentMethod: { type: String, enum: ["cash", "card", "online"] },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymongo: {
    checkoutSessionId: String,
    paymentId: String,
    referenceNumber: String,
  },
  deliveryAddress: {
    street: String,
    city: String,
    postalCode: String,
  },
  specialInstructions: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Orders", orderSchema);
