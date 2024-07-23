import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { TokenModule } from 'src/infra/token/token.module';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { AccountsModule } from '../accounts/accounts.module';
import { ProductsController } from './products.controller';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [forwardRef(() => CategoriesModule), TokenModule, AccountsModule],
  controllers: [ProductsController],
  providers: [PrismaService, ProductsRepository, ProductsService],
  exports: [ProductsRepository],
})
export class ProductsModule {}
