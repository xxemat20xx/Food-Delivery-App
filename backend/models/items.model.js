import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // URL
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  // Store-specific availability and pricing
  storePrices: [
    {
      store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
      price: { type: Number, required: true },
      isAvailable: { type: Boolean, default: true },
    },
  ],
  // Fallback global price (if same across all stores)
  basePrice: { type: Number },
  // Customizations (e.g., milk options, sugar levels)
  customizations: [
    {
      name: String,
      options: [String],
      extraCost: Number,
    },
  ],
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Items", itemSchema);
