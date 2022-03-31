"use strict";

import * as express from "express";
import { validateToken } from "../middlewares/validate_token";
import * as productController from "../controllers/product_controller";

const env = process.env.NODE_ENV || "development";
const router = express.Router();

// Routes to perform all own tasks
router.post("/product/", productController.saveProduct);
router.get("/product/:_productId", productController.getProduct);

router.get("/product/:_productId/reviews", productController.getProductReview);
router.post("/product/:_productId/review", productController.saveProductReview);

export default router;
