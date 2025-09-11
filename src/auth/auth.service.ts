
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { SellerService } from '../seller/seller.services';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './signup.dto';
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

  async sellerSignup(signupDto: SignupDto, file: Express.Multer.File) {
    // Check if seller already exists
    const existing = await this.sellerService.findByEmail(signupDto.email);
    if (existing) {
      throw new ConflictException('Seller with this email already exists');
    }
    // Construct CreateSellerDto object
    const createSellerDto = {
      ...signupDto,
      nidNumber: signupDto.nidNumber, // ensure these fields exist in signupDto or handle accordingly
      age: signupDto.age,
    };
    return await this.sellerService.createSeller(createSellerDto, file);
  }

    
  }

