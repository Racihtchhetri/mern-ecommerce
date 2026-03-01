const express = require("express");
const router = express.Router();

const controller = require("../../controllers/users/order.controller");
const auth = require("../../middlewares/auth");

router.get("/my", auth, controller.getMyOrders);
router.get("/:id", auth, controller.getOrderById);

module.exports = router;