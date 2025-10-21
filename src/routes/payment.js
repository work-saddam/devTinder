const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    //save it in my database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    //return back my order details to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Don't add userAuth here because razorpay hit this api.
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.header("X-Razorpay-Signature");
    // console.log("Webhook signature: ", webhookSignature);

    // https://razorpay.com/docs/webhooks/validate-test/
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid!" });
    }

    // Update payment status in DB
    // https://razorpay.com/docs/webhooks/payloads/payments/
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    // Update the user as premium
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // if (req.body.event == "payment.capture") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorapay
    res.status(200).json({ msg: "Webhook received successfully!" });
  } catch (error) {
    res.status(500).json({ msg: error.messages });
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
    const isPremium =
      req.user.isPremium === "true" || req.user.isPremium === true;
    if (isPremium) {
      return res.status(200).json({ isPremium: true });
    }
    return res.status(200).json({ isPremium: false });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = paymentRouter;
