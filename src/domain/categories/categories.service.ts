import { Inject, Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { TokenService } from 'src/infra/token/token.service';
import { CategoriesRepository } from './categories.repository';
import {
  CreateCategoryProps,
  UpdateCategoryProps,
} from './interface/categories.interface';

@Injectable()
export class CategoriesService {
  @Inject(ProductsRepository)
  private productsRepository: ProductsRepository;

  @Inject(AccountsRepository)
  private accountsRepository: AccountsRepository;
  @Inject(CategoriesRepository)
  private categoriesRepository: CategoriesRepository;
  @Inject(TokenService)
  private tokenService: TokenService;

  async findCategories() {
    const categories = await this.categoriesRepository.findCategories();

    return categories;
  }

  async createCategory({ token, title, description }: CreateCategoryProps) {
    const decoded: any = this.tokenService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const account = await this.accountsRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error('Account not found');
    }

    const categories = await this.categoriesRepository.findCategoriesByOwnerId(
      account.id,
    );
    const categoryExists = categories.find(
      (category) => category.title === title,
    );
    if (categoryExists) {
      throw new Error('Category already exists');
    }

    const category = await this.categoriesRepository.createCategory({
      title,
      description,
      owner_id: account.id,
    });

    return category;
  }

  async updateCategory({ token, categoryId, data }: UpdateCategoryProps) {
    const decoded: any = this.tokenService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const account = await this.accountsRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error('Account not found');
    }

    const category =
      await this.categoriesRepository.findCategoryById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    if (category.ownerId !== account.id) {
      throw new Error('Unauthorized');
    }

    const { title, description, productIds, remove_products } = data;

    if (title) {
      category.title = title;
    }

    if (description) {
      category.description = description;
    }

    const products =
      await this.productsRepository.findProductsByIds(productIds);
    const filteredProductsWithoutCategory = products
      .filter((item) => !item.categoryId && item.ownerId === account.id)
      .map((item) => item.id);
    const filteredProductsWithCurrentCategory = products
      .filter((item) => item.categoryId === category.id)
      .map((item) => item.id);

    const currentProductIds = remove_products
      ? filteredProductsWithCurrentCategory
      : filteredProductsWithoutCategory;

    const response = await this.categoriesRepository.updateCategory({
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
    const decoded: any = this.tokenService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const account = await this.accountsRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error('Account not found');
    }

    const category =
      await this.categoriesRepository.findCategoryById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    if (category.ownerId !== account.id) {
      throw new Error('Unauthorized');
    }

    const response = await this.categoriesRepository.deleteCategory(
      category.id,
    );

    return response;
  }
}
