
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { SellerService } from '../seller/seller.services';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { SellerModule } from 'src/seller/seller.module';     // Ensure this import is correct based on your project structure  

@Injectable()
export class AuthService {
  constructor(
    private sellerService: SellerService,
    private jwtService: JwtService
  ) {}

  async sellerLogin(email: string, password: string): Promise<{ access_token: string }> {
  const seller = await this.sellerService.findByEmail(email);

  if (!seller) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // Compare the provided password with the hashed password stored in DB
  const isPasswordValid = await bcrypt.compare(password, seller.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const payload = { sub: seller.id, email: seller.email };
  return {
    access_token: await this.jwtService.signAsync(payload),
  };
}  
  }

