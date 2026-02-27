const express = require("express");
const router = express.Router();

const controller = require("../controllers/order.controller");
const auth = require("../middlewares/auth");

router.get("/my", auth, controller.getMyOrders);
router.get("/:id", auth, controller.getOrderById);

module.exports = router;