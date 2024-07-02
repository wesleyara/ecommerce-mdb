import { Account } from "../models/AccountModel";
import { CreateAccountProps, UpdateRelationsProps } from "../types";

export class AccountRepository {
  async createAccount({ name, email, password }: CreateAccountProps) {
    try {
      const account = await Account.create({
        name,
        email,
        password,
      });

      await account.save();

      return account;
    } catch (error) {
      throw new Error("Account not created");
    }
  }

  async findAccountByEmail(email: string) {
    try {
      const account = await Account.findOne({ email });
      await account?.populate("products");
      await account?.populate("categories");

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }

  async findAccountById(id: string) {
    try {
      const account = await Account.findById(id);
      await account?.populate("products");
      await account?.populate("categories");

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }

  async updateRelations({ accountId, type, typeId }: UpdateRelationsProps) {
    try {
      await Account.findByIdAndUpdate(accountId, {
        $push: { [type]: typeId },
      });
    } catch (error) {
      throw new Error(`${type} not updated`);
    }
  }
}
