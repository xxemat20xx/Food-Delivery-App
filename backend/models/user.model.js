import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
    },
    location: {
      lat: Number,
      lng: Number,
    },
    googleId: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpHash: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// pre-save password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
