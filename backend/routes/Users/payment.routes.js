const express = require("express");
const router = express.Router();

const controller = require("../../controllers/users/payment.controller");
const auth = require("../../middlewares/auth");

router.post("/checkout", auth, controller.createCheckout);

router.get("/pay/:sessionId", controller.fakePay);

router.post("/webhook", controller.fakeWebhook);

module.exports = router;