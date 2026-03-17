const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");

const controller = require("../../controllers/admin/order.controller");

router.get("/", auth, isAdmin, controller.getAllOrders);

router.get("/:id", auth, isAdmin, controller.getOrderById);

router.put("/:id", auth, isAdmin, controller.updateOrder);

router.delete("/:id", auth, isAdmin, controller.deleteOrder);

module.exports = router;