import express from "express";
import { checkout } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/checkout", checkout).post(checkout);

export default router;
