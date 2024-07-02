import { Request, Response } from "express";

import { tokenAuth } from "../lib/jwt";
import { AccountService } from "../services/AccountService";

export class AccountController {
  constructor(private accountService = new AccountService()) {}

  async createAccount(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name?.trim() || !email?.trim() || !password?.trim()) {
        throw new Error("Name, email or password not provided");
      }

      await this.accountService.createAccount({
        name,
        email,
        password,
      });

      return res.status(201).json({ message: "Account created" });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email?.trim() || !password?.trim()) {
        throw new Error("Email or password not provided");
      }

      const token = await this.accountService.login({
        email,
        password,
      });

      res.status(200).json({ token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAccount(req: Request, res: Response) {
    try {
      const bearerToken = tokenAuth(req);

      if (!bearerToken) {
        throw new Error("Token not found");
      }

      const account = await this.accountService.getAccountByToken({
        token: bearerToken,
      });

      res.status(200).json({ account });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
