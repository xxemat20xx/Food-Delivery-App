import crypto from "crypto";
import Order from "../models/orders.model.js";

export const handleWebhook = async (req, res) => {
  // Log everything to debug
  console.log("=== WEBHOOK HIT ===");
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Raw body exists?", !!req.rawBody);

  const signatureHeader = req.headers["paymongo-signature"];
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

  if (!signatureHeader || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return res.status(401).send("Missing signature");
  }

  // New header format: t=timestamp,te=signature,li=livemode
  const parts = signatureHeader.split(",").reduce((acc, part) => {
    const [key, value] = part.split("=");
    acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts.t;
  const receivedSignature = parts.te; // ✅ 'te' not 'v0'
  const livemode = parts.li;

  if (!timestamp || !receivedSignature) {
    console.error("Invalid signature header format");
    return res.status(401).send("Invalid signature header");
  }

  // If rawBody is missing, try fallback (but will break signature)
  let rawBody = req.rawBody;
  if (!rawBody) {
    console.warn(
      "req.rawBody missing, falling back to req.body (signature will likely fail)",
    );
    rawBody = Buffer.from(JSON.stringify(req.body));
  }

  const payloadString = `${timestamp}.${rawBody.toString()}`;
  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(payloadString);
  const expectedSignature = hmac.digest("hex");

  console.log("Payload preview:", payloadString.substring(0, 200));
  console.log("Expected:", expectedSignature);
  console.log("Received:", receivedSignature);

  if (expectedSignature !== receivedSignature) {
    console.warn("Invalid webhook signature");
    return res.status(401).send("Invalid signature");
  }

  // Process the webhook
  try {
    const event = JSON.parse(rawBody);
    const eventType = event.type;
    const paymentData = event.attributes;

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
        console.log(`✅ Order ${order._id} marked as paid.`);
      } else {
        console.log(`Order ${orderId} not found or already paid.`);
      }
    } else {
      console.log(
        `Unhandled event type: ${eventType}, status: ${paymentData?.status}`,
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal error");
  }
};
