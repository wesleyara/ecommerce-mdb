import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { tokenAuth } from "../lib/jwt";

export class ProductController {
  constructor(readonly productService = new ProductService()) {}

  async createProduct(req: Request, res: Response) {
    const { title, description, price } = req.body;

    try {
      const bearerToken = tokenAuth(req, res);
      if (!bearerToken) {
        throw new Error("Token not found");
      }

      if (!title?.trim() || !description?.trim() || !price) {
        throw new Error("Title, description or price not provided");
      }

      const product = await this.productService.createProduct({
        token: bearerToken,
        title,
        description,
        price,
      });

      return res.status(201).json(product);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
