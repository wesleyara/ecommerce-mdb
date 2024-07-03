import { prisma } from "../lib/prisma";
import { CreateAccountProps } from "../types";

export class AccountRepository {
  async createAccount({ name, email, password }: CreateAccountProps) {
    try {
      const account = await prisma.account.create({
        data: {
          name,
          email,
          password,
        },
      });

      return account;
    } catch (error) {
      throw new Error("Account not created");
    }
  }

  async findAccountByEmail(email: string) {
    try {
      const account = await prisma.account.findUnique({
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
      throw new Error("Account not found");
    }
  }

  async findAccountById(id: string) {
    try {
      const account = await prisma.account.findUnique({
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
      throw new Error("Account not found");
    }
  }
}
