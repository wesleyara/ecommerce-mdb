import { Body, Controller, Get, Headers, Inject, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/accounts.dto';

@Controller('accounts')
export class AccountsController {
  @Inject(AccountsService)
  private accountsService: AccountsService;

  @Post('create')
  async createAccount(@Body() data: CreateAccountDto) {
    try {
      await this.accountsService.createAccount(data);

      return {
        message: 'Account created successfully',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Post('login')
  async login(@Body() data: CreateAccountDto) {
    try {
      const token = await this.accountsService.login(data);

      return {
        token,
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Get('')
  async getAccount(@Headers('authorization') token: string) {
    try {
      const splitedToken = token.split(' ')[1];
      const account = await this.accountsService.getAccountByToken({
        token: splitedToken,
      });

      return {
        account,
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
