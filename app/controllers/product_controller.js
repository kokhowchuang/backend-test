"use strict";

import mongoose from 'mongoose';
import { logger } from '../config/logger';
import Product from '../models/product';
import Review from '../models/review';

const env = process.env.NODE_ENV || 'development';

export async function saveProduct(req, res, next) {
  const name = req.body.name;
  const price = parseFloat(req.body.price);

  const newProduct = new Product();
  newProduct.name = name;
  newProduct.price = price;

  newProduct.save(function (err) {
    if (err) {
      logger.error(
        "Unable to save new product in product_controller. Error: " + err
      );

      return res.status(500).json({
        errorCode: "ERR_INTERNAL_SERVER_ERROR",
        errorMessage: "Could not save new product",
      });
    }

    res.status(200).end();
  });
}


export async function getProduct(req, res, next) {
  const productId = req.params._productId;

  Product.findOne({ _id: productId })
    .exec(function (err, record) {
      if (err) {
        logger.error('Unable to find product in product_controller. Error: ' + err);

        return res.status(500).json({
          errorCode: 'ERR_INTERNAL_SERVER_ERROR',
          errorMessage: err.message
        });
      }

      res.status(200).json({ product: record });
    });
}

export async function getProductReview(req, res, next) {
  const id = req.params._productId;

  Review.find({ _id: productId })
    .populate('userId')
    .populate('productId')
    .exec(function (err, record) {
      if (err) {
        logger.error('Unable to find product review in product_controller. Error: ' + err);

        return res.status(500).json({
          errorCode: 'ERR_INTERNAL_SERVER_ERROR',
          errorMessage: err.message
        });
      }

      res.status(200).json({ product: record });
    });
}

export async function saveProductReview(req, res, next) {
  const userId = mongoose.Types.ObjectId(req.body.userId);
  const productId = mongoose.Types.ObjectId(req.params._productId);
  const score = parseInt(req.body.score);
  const review = req.body.review;

  const newReview = new Review();
  newReview.userId = userId;
  newReview.productId = productId;
  newReview.score = score;
  newReview.review = review;

  newReview.save(function (err) {
    if (err) {
      logger.error(
        "Unable to save new review in product_controller. Error: " + err
      );

      return res.status(500).json({
        errorCode: "ERR_INTERNAL_SERVER_ERROR",
        errorMessage: err.message
      });
    }

    res.status(200).end();
  });
}