import { Account } from "../models/AccountModel";
import { CreateAccountProps } from "../types";
import { UpdateRelationsProps } from "../types/repository";

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
      const account = await Account.findOne({ email })
        .populate("products")
        .populate("categories");

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }

  async findAccountById(id: string) {
    try {
      const account = await Account.findById(id)
        .populate("products")
        .populate("categories");

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }

  async updateRelations({ modelId, type, typeIds }: UpdateRelationsProps) {
    try {
      await Account.findByIdAndUpdate(modelId, {
        $push: { [type]: typeIds },
      });
    } catch (error) {
      throw new Error(`${type} not updated`);
    }
  }

  async removeRelations({ modelId, type, typeIds }: UpdateRelationsProps) {
    try {
      await Account.findByIdAndUpdate(modelId, {
        $pullAll: { [type]: typeIds },
      });
    } catch (error) {
      throw new Error(`${type} not removed`);
    }
  }
}
