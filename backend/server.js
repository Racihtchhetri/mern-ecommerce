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

app.use("/api/payment", require("./routes/payment.routes"));

app.listen(5000, () => {
    console.log("Server rinning on 5000");
});