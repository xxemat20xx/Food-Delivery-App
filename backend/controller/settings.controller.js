import Settings from "../models/setting.model.js";

// @desc    Get app settings (public)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        taxRate: 0.1,
        deliveryFee: 3.0,
        minOrderForFreeDelivery: 20,
        storeOpenTime: "08:00",
        storeCloseTime: "22:00",
        contactEmail: "info@inarawan.com",
        contactPhone: "+1234567890",
      });
      await settings.save();
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update app settings (admin only)
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
