"use strict";

import mongoose from 'mongoose';
import { logger } from '../config/logger';
import User from '../models/user';

const env = process.env.NODE_ENV || 'development';

/**
 * List all users
 * @query {string} username 
 * @returns {array} user
 */
export async function listUser(req, res, next) {
  const userName = (typeof req.query.userName !== 'undefined') ? req.query.userName : '';
  const offset = parseFloat(req.query.offset) || 1;
  const limit = 25;
  const params = (userName !== '') ? { 'userName': { $regex: '.*' + userName.toLowerCase() + '.*' } } : {};

  try {
    const totalUserRecords = await User.find(params)
      .sort({ 'createdAt': -1 })
      .select('_id')
      .lean()
      .exec();

    User.find(params)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((offset - 1) * limit)
      .select('-password')
      .lean()
      .exec(function (err, record) {
        if (err) {
          logger.error('Unable to list user record in user_controller. Error: ' + err);

          return res.status(500).json({
            errorCode: 'ERR_INTERNAL_SERVER_ERROR',
            errorMessage: err.message
          });
        }

        res.status(200).json({
          users: (record && record.length > 0) ? record : [],
          totalUsers: totalUserRecords.length
        });
      });

  } catch (err) {
    logger.error(err);

    res.status(500).json({
      errorCode: 'ERR_INTERNAL_SERVER_ERROR',
      errorMessage: err.message
    });
  }
}

/**
 * Delete a user
 * @param {string} _userId
 * @returns {number} status
 */
export function deleteUser(req, res, next) {
  const userId = mongoose.Types.ObjectId(req.params._userId);

  User.findOne({ _id: userId },
    function (err, record) {
      if (err) {
        logger.error('Unable to get user in user_controller. Error: ' + err);

        return res.status(500).json({
          errorCode: 'ERR_INTERNAL_SERVER_ERROR',
          errorMessage: err.message
        });
      }

      if (record) {
        record.remove();
        res.status(200).end();

      } else {
        res.status(404).json({
          errorCode: 'ERR_RECORD_NOT_FOUND',
          errorMessage: 'Could not delete user that does not exist.'
        });
      }
    });
}

