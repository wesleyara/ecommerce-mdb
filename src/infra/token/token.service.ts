import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  createToken = (id: string) => {
    const jwtToken = this.jwtService.sign(
      { id },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      },
    );

    return jwtToken;
  };

  verifyToken = (token: string) => {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    return decoded;
  };
}
