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


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('seller/login')
  sellerLogin(@Body() loginDto: LoginDto) {
    return this.authService.sellerLogin(loginDto.email, loginDto.password);
  }
 
}
