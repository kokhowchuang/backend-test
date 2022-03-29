import mongoose from 'mongoose';
import { dbConnection } from '../config/db_connection';

const bcrypt = require('bcrypt-nodejs')

const userSchema = mongoose.Schema({
  firstName: { type: String, required: false, trim: true },
  lastName: { type: String, required: false, trim: true },
  password: { type: String, required: false, trim: true },
  email: { type: String, required: false, trim: true, lowercase: true, unique: true, sparse: true },
  __v: { type: Number, select: false }
},
  {
    timestamps: true,
  });

userSchema.path('email').validate(function (email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
});

userSchema.methods.generateHash = function (password) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(password, bcrypt.genSaltSync(8), null, function (err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

userSchema.methods.validatePassword = async function (password) {
  const hashPassword = this.password;

  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hashPassword, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

export default dbConnection.model('users', userSchema);
