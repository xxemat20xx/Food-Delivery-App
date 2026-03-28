import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" }, // null for global
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("Category", categorySchema);
