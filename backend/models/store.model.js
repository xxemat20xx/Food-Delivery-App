import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // allow null for existing stores
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    // Geospatial data – recommended for efficient location queries
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: "2dsphere",
      },
    },
    // Keep lat/lng for backward compatibility (optional)
    lat: Number,
    lng: Number,
    // Operating hours – flexible per day
    hours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    // Store status
    isActive: {
      type: Boolean,
      default: true,
    },
    // Visual identity
    image: {
      type: String, // URL to store logo or photo
    },
    // Delivery radius (in km) – optional for limiting orders
    deliveryRadius: {
      type: Number,
      default: 5,
    },
    // Minimum order amount for delivery
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    // Store type – useful for different business models
    storeType: {
      type: String,
      enum: ["main", "kiosk", "popup"],
      default: "main",
    },
  },
  { timestamps: true },
);

// Create geospatial index on location
storeSchema.index({ location: "2dsphere" });

export default mongoose.model("Store", storeSchema);
