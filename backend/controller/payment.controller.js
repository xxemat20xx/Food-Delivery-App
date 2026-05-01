import { createCheckoutSession } from "../services/paymongoService.js";
import { generateReference } from "../utils/generateReference.js";
import Order from "../models/orders.model.js";

export const createCheckout = async (req, res) => {
  try {
    const { items, totalAmount, userEmail, userId, storeId } = req.body;

    // 1. Create order as "pending payment"
    const newOrder = new Order({
      user: userId,
      store: storeId,
      items: items.map((i) => ({
        item: i._id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      total: totalAmount,
      status: "pending",
      paymentStatus: "pending",
    });
    await newOrder.save();

    // 2. Build PayMongo payload
    const lineItems = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      amount: Math.round(item.price * 100), // centavos
      currency: "PHP",
    }));

    const payload = {
      data: {
        attributes: {
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          line_items: lineItems,
          payment_method_types: ["card"],
          success_url: `${process.env.CLIENT_URL}/payment/success?order_id=${newOrder._id}`,
          cancel_url: `${process.env.CLIENT_URL}/payment/cancelled?order_id=${newOrder._id}`,
          reference_number: generateReference(),
          billing: { email: userEmail },
          metadata: { order_id: newOrder._id.toString() },
        },
      },
    };

    // 3. Call PayMongo API
    const result = await createCheckoutSession(payload);
    const checkoutUrl = result.data.attributes.checkout_url;
    const sessionId = result.data.id;

    // 4. Update order with session ID
    newOrder.paymongo = {
      checkoutSessionId: sessionId,
      referenceNumber: payload.data.attributes.reference_number,
    };
    await newOrder.save();

    // 5. Return checkout URL to frontend
    res.json({ checkout_url: checkoutUrl, orderId: newOrder._id });
  } catch (error) {
    console.error(
      "Create checkout error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};
