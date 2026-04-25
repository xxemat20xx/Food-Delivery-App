import crypto from "crypto";
import Order from "../models/orders.model.js";

// Helper for safe string comparison (timing safe)
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

  // ====================== DEBUG LOGS ======================
  console.log("=== WEBHOOK DEBUG START ===");
  console.log("1. Signature header:", signatureHeader);
  console.log("2. Webhook secret exists?", !!webhookSecret);
  if (webhookSecret) {
    console.log("3. Secret first 6 chars:", webhookSecret.substring(0, 6));
    console.log(
      "4. Secret last 6 chars:",
      webhookSecret.substring(webhookSecret.length - 6),
    );
  }
  console.log("5. Raw body type:", typeof req.rawBody);
  console.log("6. Raw body length:", req.rawBody?.length);
  if (req.rawBody) {
    console.log(
      "7. Raw body preview (string):",
      req.rawBody.toString().substring(0, 200),
    );
    console.log(
      "8. Raw body hex (first 32):",
      req.rawBody.subarray(0, 32).toString("hex"),
    );
  }
  // =======================================================

  // If missing header or secret, fail early
  if (!signatureHeader || !webhookSecret) {
    console.error("Missing signature or webhook secret");
    return res.status(401).send("Missing signature");
  }

  // Parse header: format "t=timestamp,v0=signature"
  const parts = signatureHeader.split(",").map((p) => p.trim());
  let timestamp = null;
  let receivedSignature = null;
  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "t") timestamp = value;
    if (key === "v0") receivedSignature = value;
  }

  if (!timestamp || !receivedSignature) {
    console.error("Invalid signature header format");
    return res.status(401).send("Invalid signature header");
  }

  // Build the payload string that PayMongo signed
  const payloadString = `${timestamp}.${req.rawBody.toString()}`;
  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(payloadString);
  const expectedSignature = hmac.digest("hex");

  console.log("9. Timestamp:", timestamp);
  console.log("10. Received signature:", receivedSignature);
  console.log("11. Expected signature:", expectedSignature);
  console.log(
    "12. Payload string preview (first 300 chars):",
    payloadString.substring(0, 300),
  );
  console.log("=== WEBHOOK DEBUG END ===");

  // ========== TEMPORARY BYPASS FOR TESTING ==========
  // Uncomment the line below to temporarily disable signature verification.
  // After you confirm the order updates, comment it again and fix the signature issue.
  // const skipSignatureCheck = true;   // <-- TEMPORARY: set to true for testing
  // if (skipSignatureCheck) {
  //   console.warn("⚠️ WEBHOOK SIGNATURE CHECK SKIPPED – FOR TESTING ONLY");
  // } else
  // ====================================================

  // Normal signature check (enable this when you want to verify)
  if (expectedSignature !== receivedSignature) {
    console.warn("Invalid webhook signature");
    return res.status(401).send("Invalid signature");
  }

  // --- Proceed to update order ---
  try {
    const event = JSON.parse(req.rawBody);
    const eventType = event.type; // "payment"
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
        console.log(`✅ Order ${order._id} marked as paid via webhook.`);
      } else {
        console.log(`Order ${orderId} already paid or not found.`);
      }
    } else if (eventType === "payment" && paymentData.status === "failed") {
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
      console.log(
        `Unhandled webhook event type: ${eventType}, status: ${paymentData.status}`,
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).send("Internal error");
  }
};
