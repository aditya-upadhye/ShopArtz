import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";
import Razorpay from "razorpay";
import cors from "cors";
import shortid from "shortid";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.post("/api/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = order.totalPrice;
  const currency = "INR";

  const options = {
    amount: (amount * 100).toString(),
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  console.log(amount);

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: "INR",
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});
// app.get("/api/keys/paypal", (req, res) => {
//   res.send(process.env.PAYPAL_CLIENT_ID || "sb");
// });
// app.get("/api/keys/google", (req, res) => {
//   res.send({ key: process.env.GOOGLE_API_KEY || "" });
// });

app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRoute);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
