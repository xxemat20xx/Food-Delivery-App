import Order from "../models/orders.model.js";
import Store from "../models/store.model.js";
import User from "../models/user.model.js";

// @desc    Create a new order (authenticated users)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      store,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      paymentMethod,
      deliveryAddress,
      specialInstructions,
    } = req.body;
    const userId = req.user.id;

    // Optional: validate store existence
    const storeExists = await Store.findById(store);
    if (!storeExists || !storeExists.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "Store not available" });
    }

    const order = new Order({
      user: userId,
      store,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      paymentMethod,
      deliveryAddress,
      specialInstructions,
      status: "pending",
      paymentStatus: "pending",
    });

    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // orders per page
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user.id })
        .populate("store", "name address")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: req.user.id }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get a single order by ID (owner or admin)
// @route   GET /api/orders/:id
// @access  Private (user or admin)
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("store", "name address phone");
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    // Check if the user is the owner or an admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all orders (admin only, with pagination)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("store", "name")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.status(200).json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    // ✅ Validate status value
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findById(req.params.id);

    // ✅ Check if order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Optional: Prevent updating finalized orders
    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a completed or cancelled order",
      });
    }

    // ✅ Optional: Enforce status flow
    const statusFlow = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["preparing", "cancelled"],
      preparing: ["out_for_delivery", "cancelled"],
      out_for_delivery: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    const allowedNextStatuses = statusFlow[order.status];

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from '${order.status}' to '${status}'`,
      });
    }

    // ✅ Update status
    order.status = status;

    // ✅ Optional: auto-update paymentStatus
    if (status === "delivered") {
      order.paymentStatus = "paid";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
