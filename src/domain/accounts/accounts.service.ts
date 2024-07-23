import { Inject, Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import {
  CreateAccountProps,
  GetAccountProps,
  LoginAccountProps,
} from './interface/accounts.interface';
import { EncryptService } from 'src/infra/encrypt/encrypt.service';
import { TokenService } from 'src/infra/token/token.service';

@Injectable()
export class AccountsService {
  @Inject(AccountsRepository)
  private accountsRepository: AccountsRepository;
  @Inject(EncryptService)
  private encryptService: EncryptService;
  @Inject(TokenService)
  private tokenService: TokenService;

  async createAccount({ name, email, password }: CreateAccountProps) {
    const existingAccount =
      await this.accountsRepository.findAccountByEmail(email);

    if (existingAccount) {
      throw new Error('Account already exists');
    }

    const passwordHash = this.encryptService.generateHash(password);

    await this.accountsRepository.createAccount({
      name,
      email,
      password: passwordHash,
    });
  }

  async login({ email, password }: LoginAccountProps) {
    const account = await this.accountsRepository.findAccountByEmail(email);

    if (!account) {
      throw new Error('Account not found');
    }

    const decryptedPassword = this.encryptService.decryptHash(account.password);

    if (decryptedPassword !== password) {
      throw new Error('Invalid password');
    }

    const token = this.tokenService.createToken(account.id);

    return token;
  }

  async getAccountByToken({ token }: GetAccountProps) {
    if (!token) {
      throw new Error('Token not provided');
    }

    const decoded: any = this.tokenService.verifyToken(token);

    if (!decoded) {
      throw new Error('Invalid token');
    }

    const account = await this.accountsRepository.findAccountById(decoded.id);

    if (!account) {
      throw new Error('Account not found');
    }

    const accountWithoutPassword = {
      ...account,
      password: undefined,
    };

    return accountWithoutPassword;
  }
}
