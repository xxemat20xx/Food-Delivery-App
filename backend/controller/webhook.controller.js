import crypto from "crypto";
import Order from "../models/orders.model.js";

const secureCompare = (a, b) => {
  if (a.length !== b.length) return false;
  const xor = a
    .split("")
    .reduce((acc, char, i) => acc ^ (char.charCodeAt(0) ^ b.charCodeAt(i)), 0);
  return xor === 0;
};

export const handleWebhook = async (req, res) => {
  const signatureHeader = req.headers["paymongo-signature"];
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

  if (!signatureHeader || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return res.status(401).send("Missing signature");
  }

  // Parse header: t=<timestamp>,v0=<signature>
  const [timestampPart, signaturePart] = signatureHeader.split(",");
  const timestamp = timestampPart.split("=")[1];
  const receivedSignature = signaturePart.split("=")[1];

  const payloadString = `${timestamp}.${req.rawBody}`;
  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(payloadString);
  const expectedSignature = hmac.digest("hex");

  if (!secureCompare(expectedSignature, receivedSignature)) {
    console.warn("Invalid webhook signature");
    return res.status(401).send("Invalid signature");
  }

  // Prevent replay attacks (timestamp within 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
    console.warn("Webhook timestamp too old");
    return res.status(401).send("Timestamp too old");
  }

  try {
    const event = JSON.parse(req.rawBody);
    const eventType = event.type; // "payment", "payment.paid", etc.
    const paymentData = event.attributes;

    // Handle payment.paid or payment with status=paid
    if (eventType === "payment" && paymentData.status === "paid") {
      const orderId = paymentData.metadata?.order_id;
      const paymentId = event.id;

      if (!orderId) {
        console.error("No order_id in webhook metadata");
        return res.status(400).send("Missing order_id");
      }

      const order = await Order.findById(orderId);
      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.status = "confirmed";
        if (!order.paymongo) order.paymongo = {};
        order.paymongo.paymentId = paymentId;
        await order.save();
        console.log(`✅ Order ${order._id} marked as paid via webhook.`);
      } else {
        console.log(`Order ${orderId} already paid or not found.`);
      }
    }
    // Optional: handle payment.failed events
    else if (eventType === "payment" && paymentData.status === "failed") {
      const orderId = paymentData.metadata?.order_id;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.paymentStatus !== "paid") {
          order.paymentStatus = "failed";
          await order.save();
          console.log(`❌ Order ${orderId} payment failed.`);
        }
      }
    } else {
      console.log(`Unhandled webhook event type: ${eventType}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Internal error");
  }
};
