import { Request, Response } from "express";

import { tokenAuth } from "../lib/jwt";
import { ProductService } from "../services/ProductService";

export class ProductController {
  constructor(readonly productService = new ProductService()) {}

  async getProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.findProducts();

      return res.status(200).json(products);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async createProduct(req: Request, res: Response) {
    const { title, description, price } = req.body;

    try {
      const bearerToken = tokenAuth(req);
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

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;

    try {
      const bearerToken = tokenAuth(req);
      if (!bearerToken) {
        throw new Error("Token not found");
      }

      if (!id || !data) {
        throw new Error("Product ID or data not provided");
      }

      const product = await this.productService.updateProduct({
        token: bearerToken,
        productId: id,
        data,
      });

      return res.status(200).json({ message: "Product updated", product });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const bearerToken = tokenAuth(req);
      if (!bearerToken) {
        throw new Error("Token not found");
      }

      if (!id) {
        throw new Error("Product ID not provided");
      }

      const product = await this.productService.deleteProduct({
        token: bearerToken,
        productId: id,
      });

      return res.status(200).json({ message: "Product deleted", product });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
