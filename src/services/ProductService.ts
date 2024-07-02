import { verifyToken } from "../lib/jwt";
import { Account } from "../models/AccountModel";
import { Product } from "../models/ProductModel";
import { AccountRepository } from "../repositories/AccountRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { CreateProductProps } from "../types";

export class ProductService {
  constructor(
    private accountRepository = new AccountRepository(),
    readonly productRepository = new ProductRepository(),
  ) {}

  async findProducts() {
    const products = await this.productRepository.findProducts();

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
      throw new Error("Invalid price");
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      throw new Error("Invalid token");
    }

    const account = await this.accountRepository.findAccountById(decoded.id);
    if (!account) {
      throw new Error("Account not found");
    }

    const products = await this.productRepository.findProductsByOwnerId(
      account._id,
    );
    const productExists = products.find(product => product.title === title);
    if (productExists) {
      throw new Error("Product already exists");
    }

    const brlPrice = `R$ ${formattedPrice.toFixed(2)}`;

    const product = new Product({
      owner_id: account._id,
      title,
      description,
      price: brlPrice,
    });

    await product.save();

    await Account.findByIdAndUpdate(account._id, {
      $push: { products: product._id },
    });

    return product;
  }
}
