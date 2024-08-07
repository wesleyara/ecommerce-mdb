import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { CategoriesService } from './categories.service';

@Injectable()
export class CategoriesConsumer {
  @Inject(CategoriesService)
  private categoriesService: CategoriesService;

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'categories',
    queue: 'categories-queue',
  })
  async consume(message: { categoryId: string; type: string }) {
    try {
      const s3Folder = 's3/categories';

      const existingS3Folder = existsSync(s3Folder);
      if (!existingS3Folder) {
        mkdirSync(s3Folder, { recursive: true });
      }

      const category = await this.categoriesService.findCategoryById(
        message.categoryId,
      );

      if (!category) {
        return new Nack(true);
      }

      if (message.type === 'delete') {
        const categoryExisting = existsSync(`${s3Folder}/${category.id}.json`);
        if (!categoryExisting) {
          return new Nack(true);
        }

        // Delete category from S3
        unlinkSync(`${s3Folder}/${category.id}.json`);
        return console.log('Category deleted');
      }

      // Create category in S3
      const categoryData = JSON.stringify(category);

      // Save category in S3
      const categoryFile = `${s3Folder}/${category.id}.json`;
      writeFileSync(categoryFile, categoryData);

      return console.log(message);
    } catch (error) {
      return new Nack(true);
    }
  }
}
