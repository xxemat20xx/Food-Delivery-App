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

  // Parse header: format t=timestamp,te=signature,li=livemode
  const parts = signatureHeader.split(",").reduce((acc, part) => {
    const [key, value] = part.split("=");
    acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts.t;
  const receivedSignature = parts.te;
  const livemode = parts.li;

  if (!timestamp || !receivedSignature) {
    console.error("Invalid signature header format");
    return res.status(401).send("Invalid signature header");
  }

  // Use rawBody (must be set by verify middleware in route)
  let rawBody = req.rawBody;
  if (!rawBody && req.body) {
    // Fallback – but ideally rawBody should be present
    rawBody = Buffer.from(JSON.stringify(req.body));
  }

  const payloadString = `${timestamp}.${rawBody.toString()}`;
  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(payloadString);
  const expectedSignature = hmac.digest("hex");

  if (!secureCompare(expectedSignature, receivedSignature)) {
    console.warn("Invalid webhook signature");
    return res.status(401).send("Invalid signature");
  }

  try {
    const fullEvent = JSON.parse(rawBody);
    // The actual event lives under `data`
    const event = fullEvent.data;
    const eventType = event.attributes.type; // e.g., "payment.paid"
    const eventData = event.attributes.data; // the payment object
    const paymentAttributes = eventData.attributes; // status, metadata, etc.

    console.log("Event type:", eventType);
    console.log("Payment status:", paymentAttributes.status);

    if (eventType === "payment.paid" && paymentAttributes.status === "paid") {
      const orderId = paymentAttributes.metadata?.order_id;
      const paymentId = eventData.id;
      const sourceType = paymentAttributes.source?.type;

      if (!orderId) {
        console.error("No order_id in webhook metadata");
        return res.status(400).send("Missing order_id");
      }

      const order = await Order.findById(orderId);
      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.status = "confirmed";
        order.paymentMethod = sourceType;
        if (!order.paymongo) order.paymongo = {};
        order.paymongo.paymentId = paymentId;
        await order.save();
        console.log(`✅ Order ${order._id} marked as paid via webhook.`);
      } else {
        console.log(`Order ${orderId} not found or already paid.`);
      }
    } else if (
      eventType === "payment.failed" &&
      paymentAttributes.status === "failed"
    ) {
      const orderId = paymentAttributes.metadata?.order_id;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.paymentStatus !== "paid") {
          order.paymentStatus = "failed";
          await order.save();
          console.log(`❌ Order ${orderId} payment failed.`);
        }
      }
    } else {
      console.log(`Unhandled webhook event: ${eventType}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Internal error");
  }
};
