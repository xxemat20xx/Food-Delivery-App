import Items from "../models/items.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

// Helper to parse JSON fields from multipart/form-data
const parseJSONFields = (body) => {
  const parsed = { ...body };

  // Safely parse the fields as JSON
  try {
    if (body.storePrices) {
      parsed.storePrices = JSON.parse(body.storePrices);
    }
  } catch (e) {
    console.error("Error parsing storePrices: ", e);
    parsed.storePrices = []; // Fallback to an empty array
  }

  try {
    if (body.customizations) {
      parsed.customizations = JSON.parse(body.customizations);
    }
  } catch (e) {
    console.error("Error parsing customizations: ", e);
    parsed.customizations = []; // Fallback to an empty array
  }

  return parsed;
};
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
    // Parse JSON fields (since they come as strings in multipart)
    const itemData = parseJSONFields(req.body);
    const {
      name,
      description,
      category,
      storePrices,
      basePrice,
      customizations,
    } = itemData;

    // Validate that these fields are not undefined or null
    if (!storePrices || !customizations) {
      return res.status(400).json({
        success: false,
        message: "Store Prices or Customizations are missing or malformed",
      });
    }

    // Handle image upload
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "items");
      imageUrl = result.secure_url; // Get image URL from Cloudinary
    }

    // Create new item in the database
    const newItem = new Items({
      name,
      description,
      image: imageUrl,
      category,
      storePrices,
      basePrice,
      customizations,
      isAvailable: true,
    });

    await newItem.save();

    // Respond with the new item
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error("Error during item creation: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update item (admin only)
// @route   PUT /api/admin/items/:id
// @access  Private/Admin
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Items.findById(id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    // Parse JSON fields
    const updateData = parseJSONFields(req.body);

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (item.image) {
        const publicId = item.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0]; // extract public ID
        await deleteFromCloudinary(publicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, "items");
      updateData.image = result.secure_url;
    }

    // Update the item
    const updated = await Items.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  // URL pattern: https://res.cloudinary.com/.../upload/v1234567890/folder/image.jpg
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  const publicIdWithExt = parts[1];
  // Remove version prefix (v1234567890/) if present
  const withoutVersion = publicIdWithExt.replace(/^v\d+\//, "");
  // Remove file extension
  const lastDot = withoutVersion.lastIndexOf(".");
  return lastDot !== -1 ? withoutVersion.substring(0, lastDot) : withoutVersion;
};
// @desc    Delete item (soft delete + remove image from Cloudinary)
// @route   DELETE /api/admin/items/:id
// @access  Private/Admin
export const deleteItem = async (req, res) => {
  try {
    const item = await Items.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Delete image from Cloudinary
    if (item.image) {
      const publicId = getPublicIdFromUrl(item.image);

      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (err) {
          console.error("Cloudinary deletion error:", err);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
