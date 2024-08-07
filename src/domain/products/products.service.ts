import { Inject, Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import {
  CreateProductProps,
  DeleteProductProps,
  EditProductProps,
} from './interface/products.interface';
import { TokenService } from 'src/infra/token/token.service';
import { AccountsRepository } from '../accounts/accounts.repository';
import { CategoriesRepository } from '../categories/categories.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ProductsService {
  constructor(private amqpConnection: AmqpConnection) {}
  @Inject(CategoriesRepository)
  private categoriesRepository: CategoriesRepository;

  @Inject(AccountsRepository)
  private accountsRepository: AccountsRepository;
  @Inject(ProductsRepository)
  private productsRepository: ProductsRepository;
  @Inject(TokenService)
  private tokenService: TokenService;

  async findProducts() {
    const products = await this.productsRepository.findProducts();

    return products;
  }

  async createProduct({
    token,
    title,
    description,
    price,
  }: CreateProductProps) {
    const formattedPrice = parseFloat(price);
    if (isNaN(formattedPrice)) {
      throw new Error('Invalid price');
    }

    const decoded: any = this.tokenService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const account = await this.accountsRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error('Account not found');
    }

    const products = await this.productsRepository.findProductsByOwnerId(
      account.id,
    );
    const productExists = products.find((product) => product.title === title);
    if (productExists) {
      throw new Error('Product already exists');
    }

    const brlPrice = `R$ ${formattedPrice.toFixed(2)}`;

    const product = await this.productsRepository.createProduct({
      title,
      description,
      price: brlPrice,
      owner_id: account.id,
    });

    await this.amqpConnection.publish('amq.direct', 'products', {
      productId: product.id,
      type: 'create',
    });

    return product;
  }

  async updateProduct({ token, productId, data }: EditProductProps) {
    const decoded: any = this.tokenService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const account = await this.accountsRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error('Account not found');
    }

    const product = await this.productsRepository.findProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.ownerId !== account.id) {
      throw new Error('Unauthorized');
    }

    const { title, description, price, category_id, remove_category } = data;

    let brlPrice = '';
    if (price) {
      const formattedPrice = parseFloat(price);
      if (isNaN(formattedPrice)) {
        throw new Error('Invalid price');
      }

      brlPrice = `R$ ${formattedPrice.toFixed(2)}`;
    }

    const categoryId = remove_category ? undefined : category_id || undefined;
    if (categoryId) {
      const category =
        await this.categoriesRepository.findCategoryById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    const response = await this.productsRepository.updateProduct({
      productId: product.id,
      data: {
        title,
        description,
        price: brlPrice || undefined,
        categoryId,
      },
      remove_category,
    });

    if (category_id || (remove_category && product.categoryId)) {
      await this.amqpConnection.publish('amq.direct', 'categories', {
        categoryId: category_id || product.categoryId,
        type: 'update',
      });
    }

    await this.amqpConnection.publish('amq.direct', 'products', {
      productId: product.id,
      type: 'update',
    });

    return response;
  }

  async deleteProduct({ token, productId }: DeleteProductProps) {
    const decoded: any = this.tokenService.verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const account = await this.accountsRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error('Account not found');
    }

    const product = await this.productsRepository.findProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.ownerId !== account.id) {
      throw new Error('Unauthorized');
    }

    await this.productsRepository.deleteProductById(product.id);

    await this.amqpConnection.publish('amq.direct', 'products', {
      productId: product.id,
      type: 'delete',
    });

    return product;
  }

  async findProductById(productId: string) {
    try {
      const product = await this.productsRepository.findProductById(productId);

      return product;
    } catch (error) {
      throw new Error('Product not found');
    }
  }
}
