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

  // Optional: prevent replay attacks (timestamp within 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
    console.warn("Webhook timestamp too old");
    return res.status(401).send("Timestamp too old");
  }

  try {
    const event = JSON.parse(req.rawBody);
    const eventType = event.data.attributes.type;

    if (eventType === "payment.paid") {
      const paymentData = event.data.attributes.data;
      const checkoutSessionId = paymentData.attributes.checkout_session_id;
      const paymentId = paymentData.id;

      const order = await Order.findOne({
        "paymongo.checkoutSessionId": checkoutSessionId,
      });
      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.status = "confirmed";
        order.paymongo.paymentId = paymentId;
        await order.save();
        console.log(`✅ Order ${order._id} paid.`);
      }
    }

    if (eventType === "payment.failed") {
      const paymentData = event.data.attributes.data;
      const checkoutSessionId = paymentData.attributes.checkout_session_id;
      const order = await Order.findOne({
        "paymongo.checkoutSessionId": checkoutSessionId,
      });
      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "failed";
        await order.save();
        console.log(`❌ Order ${order._id} payment failed.`);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal error");
  }
};
