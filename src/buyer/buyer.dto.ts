import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class CreateBuyerDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must only contain letters and spaces (no numbers allowed)',
  })
  bname: string;

  @IsEmail()
  @IsNotEmpty()
  bemail: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^01\d+$/, {
    message: 'Phone number must start with "01" and contain only digits',
  })
  bphone: string;

  @IsNotEmpty()
  @IsString()
  busername: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/.*[a-z].*/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/.*[@#$&].*/, {
    message: 'Password must contain at least one special character (@, #, $, or &)',
  })
  bpassword: string;
}

export class UpdateBuyerDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must only contain letters and spaces (no numbers allowed)',
  })
  bname?: string;

  @IsOptional()
  @IsEmail()
  bemail?: string;

  @IsOptional()
  @IsString()
  @Matches(/^01\d+$/, {
    message: 'Phone number must start with "01" and contain only digits',
  })
  bphone?: string;

  @IsOptional()
  @IsString()
  busername?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/.*[a-z].*/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/.*[@#$&].*/, {
    message: 'Password must contain at least one special character (@, #, $, or &)',
  })
  bpassword?: string;
}
