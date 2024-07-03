import { verifyToken } from "../lib/jwt";
import { AccountRepository } from "../repositories/AccountRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { CreateCategoryProps } from "../types";

export class CategoryService {
  constructor(
    private accountRepository = new AccountRepository(),
    private categoryRepository = new CategoryRepository(),
    private productRepository = new ProductRepository(),
  ) {}

  async findCategories() {
    const categories = await this.categoryRepository.findCategories();

    return categories;
  }

  async createCategory({ token, title, description }: CreateCategoryProps) {
    const decoded: any = verifyToken(token);
    if (!decoded) {
      throw new Error("Invalid token");
    }

    const account = await this.accountRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error("Account not found");
    }

    const categories = await this.categoryRepository.findCategoriesByOwnerId(
      account.id,
    );
    const categoryExists = categories.find(
      category => category.title === title,
    );
    if (categoryExists) {
      throw new Error("Category already exists");
    }

    const category = await this.categoryRepository.createCategory({
      title,
      description,
      owner_id: account.id,
    });

    return category;
  }

  async updateCategory({ token, categoryId, data }: any) {
    const decoded: any = verifyToken(token);
    if (!decoded) {
      throw new Error("Invalid token");
    }

    const account = await this.accountRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error("Account not found");
    }

    const category = await this.categoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    if (category.ownerId !== account.id) {
      throw new Error("Unauthorized");
    }

    const { title, description, productIds, remove_products } = data;

    if (title) {
      category.title = title;
    }

    if (description) {
      category.description = description;
    }

    const products = await this.productRepository.findProductsByIds(productIds);
    const filteredProductsWithoutCategory = products
      .filter(item => !item.categoryId && item.ownerId === account.id)
      .map(item => item.id);
    const filteredProductsWithCurrentCategory = products
      .filter(item => item.categoryId === category.id)
      .map(item => item.id);

    const currentProductIds = remove_products
      ? filteredProductsWithCurrentCategory
      : filteredProductsWithoutCategory;

    const response = await this.categoryRepository.updateCategory({
      categoryId: category.id,
      data: {
        title: category.title,
        description: category.description,
        productIds: currentProductIds,
      },
      remove_products,
    });

    return response;
  }

  async deleteCategory({ token, categoryId }: any) {
    const decoded: any = verifyToken(token);
    if (!decoded) {
      throw new Error("Invalid token");
    }

    const account = await this.accountRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error("Account not found");
    }

    const category = await this.categoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    if (category.ownerId !== account.id) {
      throw new Error("Unauthorized");
    }

    const response = await this.categoryRepository.deleteCategory(category.id);

    return response;
  }
}
