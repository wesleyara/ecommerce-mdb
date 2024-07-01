import { Account } from "../models/AccountModel";

export class AccountRepository {
  async findAccountByEmail(email: string) {
    try {
      const account = await Account.findOne({ email });
      await account?.populate("products");

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }

  async findAccountById(id: string) {
    try {
      const account = await Account.findById(id);
      await account?.populate("products");

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }
}
