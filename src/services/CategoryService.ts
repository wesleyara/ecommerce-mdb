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
      account._id,
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
      owner_id: account._id,
    });

    await this.accountRepository.updateRelations({
      modelId: account._id,
      type: "categories",
      typeId: category._id,
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

    if (category.owner_id.toString() !== account._id?.toString()) {
      throw new Error("Unauthorized");
    }

    const { title, description, productIds } = data;

    if (title) {
      category.title = title;
    }

    if (description) {
      category.description = description;
    }

    const promises = [];

    promises.push(
      this.categoryRepository.updateCategory({
        categoryId: category._id,
        title: category.title,
        description: category.description,
      }),
    );

    if (productIds) {
      category.products = [category.products, ...productIds];

      promises.push(
        this.categoryRepository.updateRelations({
          modelId: category._id,
          type: "products",
          typeId: productIds,
        }),
      );

      promises.push(
        this.productRepository.updateManyProducts({
          productIds,
          category_id: category._id,
        }),
      );
    }

    const [response] = await Promise.all(promises);

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

    if (category.owner_id.toString() !== account._id?.toString()) {
      throw new Error("Unauthorized");
    }

    const products = await this.productRepository.findProductsByCategoryId(
      category._id,
    );
    const productsIds = products.map(product => product._id);

    const promises = [];

    promises.push(
      this.productRepository.updateManyProducts({
        productIds: productsIds,
        category_id: null,
        remove_category: true,
      }),
    );

    promises.push(this.categoryRepository.deleteCategory(category._id));

    await Promise.all(promises);

    return category;
  }
}
