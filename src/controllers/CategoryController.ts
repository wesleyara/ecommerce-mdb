import { Request, Response } from "express";

import { tokenAuth } from "../lib/jwt";
import { CategoryService } from "../services/CategoryService";

export class CategoryController {
  constructor(readonly categoryService = new CategoryService()) {}

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.findCategories();

      return res.status(200).json(categories);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async createCategory(req: Request, res: Response) {
    const { title, description } = req.body;

    try {
      const bearerToken = tokenAuth(req);
      if (!bearerToken) {
        throw new Error("Token not found");
      }

      if (!title?.trim() || !description?.trim()) {
        throw new Error("Title or description not provided");
      }

      const category = await this.categoryService.createCategory({
        token: bearerToken,
        title,
        description,
      });

      return res.status(201).json(category);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;

    try {
      const bearerToken = tokenAuth(req);
      if (!bearerToken) {
        throw new Error("Token not found");
      }

      if (!id || !data) {
        throw new Error("Category ID or data not provided");
      }

      const category = await this.categoryService.updateCategory({
        token: bearerToken,
        categoryId: id,
        data,
      });

      return res.status(200).json(category);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const bearerToken = tokenAuth(req);
      if (!bearerToken) {
        throw new Error("Token not found");
      }

      if (!id) {
        throw new Error("Category ID not provided");
      }

      const response = await this.categoryService.deleteCategory({
        token: bearerToken,
        categoryId: id,
      });

      return res.status(204).json({ message: "Category deleted", response });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
