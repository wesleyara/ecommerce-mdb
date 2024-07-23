import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [AccountsModule, ProductsModule, CategoriesModule],
})
export class DomainModule {}
