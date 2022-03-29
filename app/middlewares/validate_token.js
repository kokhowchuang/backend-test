import * as jwt from 'jsonwebtoken';
import { variable } from '../config/environment_variable';

const env = process.env.NODE_ENV || 'development';

export function validateToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];

      req.token = bearerToken;

      jwt.verify(req.token, variable[env].JWT.SECRETKEY, function(err, decoded) {
        if (err) {
          res.status(403).json({ 
            errorCode: 'ERR_AUTHENTICATION_FAILED',
            errorMessage: 'Failed to authenticate access token'
          });
        }

        req.userId = decoded.userId;
        next();
      });
  } else {
    res.status(403).json({
      errorCode: 'ERR_AUTHENTICATION_FAILED',
      errorMessage: 'Failed to authenticate access token'
    });
  }
}

export function validateAdminToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];

      req.token = bearerToken;

      jwt.verify(req.token, variable[env].JWT.SECRETKEY, function(err, decoded) {
        if (err) {
          return res.status(403).json({ 
            errorCode: 'ERR_AUTHENTICATION_FAILED',
            errorMessage: 'Failed to authenticate access token'
          });
        }

        if (typeof decoded.adminId !== 'undefined') {
          req.adminId = decoded.adminId;
        } else {
          return res.status(403).json({ 
            errorCode: 'ERR_PERMISSION_DENIED',
            errorMessage: 'Only admins are allowed to perform such operation'
          });
        }

        next();
      });
  } else {
    res.status(403).json({
      errorCode: 'ERR_AUTHENTICATION_FAILED',
      errorMessage: 'Failed to authenticate access token'
    });
  }
}

export function validateTokenOrSkip(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];

      req.token = bearerToken;

      jwt.verify(req.token, variable[env].JWT.SECRETKEY, function(err, decoded) {
        if (err) {
          res.status(403).json({ 
            errorCode: 'ERR_AUTHENTICATION_FAILED',
            errorMessage: 'Failed to authenticate access token'
          });
        }

        req.userId = decoded.userId;
        next();
      });
  } else {
    next();
  }
}
