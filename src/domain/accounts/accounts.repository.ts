import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateAccountProps } from './interface/accounts.interface';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount({ name, email, password }: CreateAccountProps) {
    try {
      const account = await this.prisma.account.create({
        data: {
          name,
          email,
          password,
        },
      });

      return account;
    } catch (error) {
      throw new Error('Account not created');
    }
  }

  async findAccountByEmail(email: string) {
    try {
      const account = await this.prisma.account.findUnique({
        where: {
          email,
        },
        include: {
          products: true,
          categories: true,
        },
      });

      return account;
    } catch (error) {
      throw new Error('Account not found');
    }
  }

  async findAccountById(id: string) {
    try {
      const account = await this.prisma.account.findUnique({
        where: {
          id,
        },
        include: {
          products: true,
          categories: true,
        },
      });

      return account;
    } catch (error) {
      throw new Error('Account not found');
    }
  }
}
