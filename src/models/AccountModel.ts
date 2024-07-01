import { model, Schema, Document } from "mongoose";

export interface IAccount extends Document {
  name: string;
  email: string;
  password: string;
  products: string[]; // This should be an array of product IDs
  categories: string[]; // This should be an array of category IDs
}

const AccountSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

const Account = model<IAccount>("Account", AccountSchema);

export { Account };
