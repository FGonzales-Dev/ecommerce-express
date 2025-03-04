import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './Category';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: mongoose.Types.ObjectId | ICategory;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
