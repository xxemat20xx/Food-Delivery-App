import Items from "../models/items.model.js";

// @desc    Get all items (public, can filter by category, store, etc.)
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
  try {
    const { category, storeId } = req.query;
    let filter = { isAvailable: true };
    if (category) filter.category = category;
    if (storeId) filter["storePrices.store"] = storeId;

    const items = await Items.find(filter)
      .populate("category", "name")
      .sort("name");
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItem = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id).populate(
      "category",
      "name",
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Create new item (admin only)
// @route   POST /api/admin/items
// @access  Private/Admin
export const createItem = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      category,
      storePrices,
      basePrice,
      customizations,
    } = req.body;
    const newItem = new Items({
      name,
      description,
      image,
      category,
      storePrices,
      basePrice,
      customizations,
      isAvailable: true,
    });
    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update item (admin only)
// @route   PUT /api/admin/items/:id
// @access  Private/Admin
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Items.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete item (soft delete)
// @route   DELETE /api/admin/items/:id
// @access  Private/Admin
export const deleteItem = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    item.isAvailable = false;
    await item.save();
    res.status(200).json({ success: true, message: "Item deactivated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
