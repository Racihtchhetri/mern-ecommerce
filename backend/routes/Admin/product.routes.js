const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");

const controller = require("../../controllers/Admin/product.controller");
const upload = require("../../middlewares/upload");

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "variantImages", maxCount: 20 }
  ]),
  controller.createProduct
);

router.delete("/:id", controller.deleteProduct);

module.exports = router;