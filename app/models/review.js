import mongoose from 'mongoose';
import { dbConnection } from '../config/db_connection';

const reviewSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true, index: true },
  score: { type: Number, required: true },
  review: { type: String, required: true, trim: true },
  __v: { type: Number, select: false }
},
  {
    timestamps: true,
  });

export default dbConnection.model('reviews', reviewSchema);
