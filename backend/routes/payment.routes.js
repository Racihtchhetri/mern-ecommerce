const router = requeire(express).Router();
const controller = require(".../controllers/payment.controller");

router.post("/checkout", controller.createCheckout);
router.post("/webhook", controller.razorpayWebhook);

module.exports = router;