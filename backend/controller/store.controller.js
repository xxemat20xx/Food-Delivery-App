import Store from "../models/store.model.js";

// Helper: generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
};

// Get all active store (public)
export const getStores = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query;
    let query = { isActive: true };

    if (lat && lng) {
      // Ensure lat and lng are numbers and log them
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      console.log("Latitude:", latitude, "Longitude:", longitude);

      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude], // Correct order: [longitude, latitude]
          },
          $maxDistance: parseInt(maxDistance), // Max distance in meters (5000 meters = 5 km)
        },
      };
    }

    const stores = await Store.find(query).select("-__v");

    if (stores.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No stores available." });
    }

    res.status(200).json({ success: true, count: stores.length, data: stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// @desc    Get single store by ID or slug
// @route   GET /api/stores/:idOrSlug
export const getStore = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let store = await Store.findById(idOrSlug).select("-__v");
    if (!store)
      store = await Store.findOne({ slug: idOrSlug, isActive: true }).select(
        "-__v",
      );
    if (!store)
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    res.status(200).json({ success: true, data: store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createStore = async (req, res) => {
  try {
    const {
      name,
      address,
      lat,
      lng,
      phone,
      email,
      hours,
      image,
      deliveryRadius,
      minOrderAmount,
      storeType,
      description,
    } = req.body;

    // Auto‑generate slug
    let slug = generateSlug(name);
    let slugExists = await Store.findOne({ slug });
    if (slugExists) slug = `${slug}-${Date.now()}`;

    let location = null;
    if (lat && lng) {
      location = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      };
    }

    const newStore = new Store({
      name,
      slug,
      address,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      location,
      phone,
      email,
      hours,
      image,
      deliveryRadius,
      minOrderAmount,
      storeType,
      description,
      isActive: true,
    });

    const saved = await newStore.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.keyPattern?.slug) {
      return res
        .status(400)
        .json({ success: false, message: "Slug already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// @desc    Update an existing store (admin only)
// @route   PUT /api/admin/stores/:id
// @access  Private/Admin
export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.name) {
      let newSlug = generateSlug(updateData.name);
      const existing = await Store.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existing) newSlug = `${newSlug}-${Date.now()}`;
      updateData.slug = newSlug;
    }

    if (updateData.lat && updateData.lng) {
      updateData.location = {
        type: "Point",
        coordinates: [parseFloat(updateData.lng), parseFloat(updateData.lat)],
      };
    } else if (updateData.lat === null || updateData.lng === null) {
      updateData.location = undefined;
    }

    const updated = await Store.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Soft delete a store (set isActive = false)
// @route   DELETE /api/admin/stores/:id
// @access  Private/Admin
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!store)
      return res
        .status(404)
        .json({ success: false, message: "Store not found" });
    store.isActive = false;
    await store.save();
    res.status(200).json({ success: true, message: "Store deactivated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
