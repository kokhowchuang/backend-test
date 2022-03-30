import mongoose from 'mongoose';
import { dbConnection } from '../config/db_connection';

const productSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  __v: { type: Number, select: false }
},
  {
    timestamps: true,
  });

export default dbConnection.model('products', productSchema);
