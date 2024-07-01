import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  owner_id: Types.ObjectId;
  title: string;
  description: string;
  price: string;
  category: Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>({
  owner_id: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

const Product = model<IProduct>("Product", ProductSchema);

export { Product };
