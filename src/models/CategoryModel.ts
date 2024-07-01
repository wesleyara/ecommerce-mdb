import { Schema, model, Document, Types } from "mongoose";

export interface ICategory extends Document {
  owner_id: Types.ObjectId;
  title: string;
  description: string;
  products: Types.ObjectId[];
}

const CategorySchema = new Schema<ICategory>({
  owner_id: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const Category = model<ICategory>("Category", CategorySchema);

export { Category };
