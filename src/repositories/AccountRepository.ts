import { Account } from "../models/AccountModel";

export class AccountRepository {
  async findAccountByEmail(email: string) {
    try {
      const account = await Account.findOne({ email });

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }

  async findAccountById(id: string) {
    try {
      const account = await Account.findById(id);

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }
}
