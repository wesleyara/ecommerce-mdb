/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { decryptHash, generateHash } from "../lib/generateHash";
import { createToken, verifyToken } from "../lib/jwt";
import { Account } from "../models/AccountModel";
import { AccountRepository } from "../repositories/AccountRepository";
import {
  CreateAccountProps,
  GetAccountProps,
  LoginAccountProps,
} from "../types";
import { SECRET } from "../utils/constants";

export class AccountService {
  constructor(private accountRepository = new AccountRepository()) {}

  async createAccount({ name, email, password }: CreateAccountProps) {
    const existingAccount = await this.accountRepository.findAccountByEmail(
      email,
    );

    if (existingAccount) {
      throw new Error("Account already exists");
    }

    const passwordHash = generateHash(password, SECRET);

    const account = new Account({
      name,
      email,
      password: passwordHash,
    });

    await account.save();
  }

  async login({ email, password }: LoginAccountProps) {
    const account = await this.accountRepository.findAccountByEmail(email);

    if (!account) {
      throw new Error("Account not found");
    }

    const decryptedPassword = decryptHash(account.password, SECRET);

    if (decryptedPassword !== password) {
      throw new Error("Invalid password");
    }

    const token = createToken(account._id);

    return token;
  }

  async getAccountByToken({ token }: GetAccountProps) {
    if (!token) {
      throw new Error("Token not provided");
    }

    const decoded: any = verifyToken(token);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const account = await this.accountRepository.findAccountById(decoded.id);

    if (!account) {
      throw new Error("Account not found");
    }

    const accountWithoutPassword = {
      ...account.toObject(),
      password: undefined,
    };

    return accountWithoutPassword;
  }
}
