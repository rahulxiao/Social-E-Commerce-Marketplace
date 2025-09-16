import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { SignupDto } from './signup.dto';
import { CreateBuyerDto } from '../buyer/buyer.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('seller/login')
  sellerLogin(@Body() loginDto: LoginDto) {
    return this.authService.sellerLogin(loginDto.email, loginDto.password);
  }
  @Post('seller/signup')
  @UseInterceptors(FileInterceptor('file'))
  sellerSignup(
    @Body() signupDto: SignupDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.sellerSignup(signupDto, file);
  }

  // Buyer authentication endpoints
  @HttpCode(HttpStatus.OK)
  @Post('buyer/login')
  buyerLogin(@Body() loginDto: LoginDto) {
    return this.authService.buyerLogin(loginDto.email, loginDto.password);
  }

  @Post('buyer/signup')
  @UseInterceptors(FileInterceptor('file'))
  buyerSignup(
    @Body() createBuyerDto: CreateBuyerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.buyerSignup(createBuyerDto, file);
  }
}
