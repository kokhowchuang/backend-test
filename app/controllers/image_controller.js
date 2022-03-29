"use strict";

import mongoose from 'mongoose';
import { logger } from '../config/logger';
import Image from '../models/image';

const env = process.env.NODE_ENV || 'development';

/**
 * List all images
 * @query {string} username 
 * @returns {array} user
 */
export async function listImage(req, res, next) {
  const limit = 25;
  const offset = parseFloat(req.query.offset) || 1;

  Image.find({})
    .sort({ 'createdAt': -1 })
    .lean()
    .limit(limit)
    .skip((offset - 1) * limit)
    .exec(function (err, record) {
      if (err) {
        logger.error('Unable to list image in image_controller. Error: ' + err);

        return res.status(500).json({
          errorCode: 'ERR_INTERNAL_SERVER_ERROR',
          errorMessage: 'Could not list image'
        });
      }

      res.status(200).json({
        images: (record && record.length > 0) ? record : [],
        total: record.length
      });
    });
}

/**
 * Save images
 * @query {string} username 
 * @returns {array} user
 */
export async function saveImage(req, res, next) {
  const link = req.body.link;
  const description = req.body.description;

  const newImage = new Image();

  newImage.link = link;
  newImage.description = description;

  newImage.save(function (err) {
    if (err) {
      logger.error('Unable to save new image in image_controller. Error: ' + err);

      return res.status(500).json({
        errorCode: 'ERR_INTERNAL_SERVER_ERROR',
        errorMessage: 'Could not save new image'
      });
    }

    res.status(200).end();
  });
}
