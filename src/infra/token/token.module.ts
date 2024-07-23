import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TokenService, JwtService],
  exports: [TokenService, JwtService],
})
export class TokenModule {}
