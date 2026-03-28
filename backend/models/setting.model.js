import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  taxRate: { type: Number, default: 0 }, // e.g., 0.1 for 10%
  deliveryFee: { type: Number, default: 0 },
  minOrderForFreeDelivery: { type: Number, default: 0 },
  storeOpenTime: String,
  storeCloseTime: String,
  contactEmail: String,
  contactPhone: String,
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Settings", settingsSchema);
