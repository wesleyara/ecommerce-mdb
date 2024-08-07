import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsConsumer {
  @Inject(ProductsService)
  private productsService: ProductsService;

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'products',
    queue: 'products-queue',
  })
  async consume(message: { productId: string; type: string }) {
    try {
      const s3Folder = 's3/products';

      const existingS3Folder = existsSync(s3Folder);
      if (!existingS3Folder) {
        mkdirSync(s3Folder, { recursive: true });
      }

      const product = await this.productsService.findProductById(
        message.productId,
      );

      if (!product) {
        return new Nack(true);
      }

      if (message.type === 'delete') {
        const productExisting = existsSync(`${s3Folder}/${product.id}.json`);
        if (!productExisting) {
          return new Nack(true);
        }

        // Delete product from S3
        unlinkSync(`${s3Folder}/${product.id}.json`);
        return console.log('Product deleted');
      }

      // Create product in S3
      const productData = JSON.stringify(product);

      // Save product in S3
      const productFile = `${s3Folder}/${product.id}.json`;
      writeFileSync(productFile, productData);

      return console.log(message);
    } catch (error) {
      return new Nack(true);
    }
  }
}
