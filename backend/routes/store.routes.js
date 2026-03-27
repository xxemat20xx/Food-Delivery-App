import express from "express";
import { Store } from "../models/store.model.js";

const router = express.Router();

// GET all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/seed", async (req, res) => {
  try {
    await Store.deleteMany(); // optional: clear old data

    const stores = await Store.insertMany([
      {
        name: "Inarawan Coffee Marikina",
        address: "Marikina City",
        lat: 14.6507,
        lng: 121.1029,
      },
      {
        name: "Inarawan Coffee Antipolo",
        address: "Antipolo City",
        lat: 14.6255,
        lng: 121.1245,
      },
    ]);

    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
