"use strict";

import jwt from "jsonwebtoken";
import { variable } from "../config/environment_variable";
import { logger } from "../config/logger";
import passport from "../controllers/passport";

const env = process.env.NODE_ENV || "development";
const jwtSecretKey = process.env.JWT_SECRET_KEY || variable[env].JWT.SECRETKEY;

/**
 * Create new user using email
 * @param {string} email
 * @param {string} password
 * @returns {string} access token
 */
export function createUser(req, res, next) {
  // Sign up user using email + password
  passport.authenticate("email-signup", function (err, user, message) {
    if (err) {
      logger.warn(
        "Unable to authenticate user in auth_controller.js. Error: " + err
      );

      return res.status(500).json({
        errorCode: "ERR_INTERNAL_SERVER_ERROR",
        errorMessage: err,
      });
    }

    if (!user) {
      return res.status(400).json({
        errorCode: "ERR_EMAIL_TAKEN",
        errorMessage: message,
      });
    }

    // Sign token with secret key and make the key expiration to 1 year
    const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: "365d",
    });

    user.password = undefined;

    res.status(200).json({
      accessToken: token,
      ...JSON.parse(JSON.stringify(user)),
    });
  })(req, res, next);
}

/**
 * Authenticate user using email and password
 * @param {string} email
 * @param {string} password
 * @returns {object} user
 */
export function authenticateUser(req, res, next) {
  // Authenticate user using email + password
  passport.authenticate("email-login", function (err, user, message) {
    if (err) {
      logger.warn(
        "Unable to authenticate user from POST routes: /auth/login in auth_controller.js. Error: " +
          err
      );

      return res.status(500).json({
        errorCode: "ERR_INTERNAL_SERVER_ERROR",
        errorMessage: err,
      });
    }

    if (!user) {
      return res.status(401).json({
        errorCode: "ERR_AUTHENTICATION_FAILED",
        errorMessage: message,
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        logger.warn(
          "Unable to log user in from POST routes: /auth/login in auth_controller.js. Error: " +
            err
        );

        return res.status(500).json({
          errorCode: "ERR_INTERNAL_SERVER_ERROR",
          errorMessage: err,
        });
      }

      // Sign token with secret key and make the key expiration to 1 year
      const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
        expiresIn: "365d",
      });

      user.password = undefined;

      res.status(200).json({
        accessToken: token,
        ...JSON.parse(JSON.stringify(user)),
      });
    });
  })(req, res, next);
}
