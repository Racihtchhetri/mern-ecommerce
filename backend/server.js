require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


app.use(cors());

app.use("/api/payment/webhook", express.raw({ type: "*/*"}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo connected"))
    .catch(err => console.log(err));

app.use("/api/payment", require("./routes/users/payment.routes"));
app.use("/api/orders", require("./routes/users/order.routes"));
app.use("/api/products", require("./routes/users/product.routes"));
app.use("/api/auth", require("./routes/users/auth.routes"));

app.listen(5000, () => {
    console.log("Server rinning on 5000");
});