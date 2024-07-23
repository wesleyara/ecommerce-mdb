import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { TokenModule } from 'src/infra/token/token.module';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { AccountsModule } from '../accounts/accounts.module';
import { ProductsModule } from '../products/products.module';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [forwardRef(() => ProductsModule), TokenModule, AccountsModule],
  controllers: [CategoriesController],
  providers: [PrismaService, CategoriesRepository, CategoriesService],
  exports: [CategoriesRepository],
})
export class CategoriesModule {}
