import { verifyToken } from "../lib/jwt";
import { AccountRepository } from "../repositories/AccountRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CreateCategoryProps } from "../types";

export class CategoryService {
  constructor(
    private accountRepository = new AccountRepository(),
    private categoryRepository = new CategoryRepository(),
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
      accountId: account._id,
      type: "categories",
      typeId: category._id,
    });

    return category;
  }
}
