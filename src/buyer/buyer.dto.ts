import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  IsBoolean,
} from 'class-validator';

export class CreateBuyerDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must only contain letters and spaces (no numbers allowed)',
  })
  fullName?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^01\d+$/, {
    message: 'Phone number must start with "01" and contain only digits',
  })
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  bemail: string;

  @IsNotEmpty()
  @IsString()
  busername: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/.*[a-z].*/, {
    message: 'Password must contain at least one lowercase letter',
  })
  bpassword: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateBuyerDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must only contain letters and spaces (no numbers allowed)',
  })
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^01\d+$/, {
    message: 'Phone number must start with "01" and contain only digits',
  })
  phone?: string;

  @IsOptional()
  @IsEmail()
  bemail?: string;

  @IsOptional()
  @IsString()
  busername?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/.*[a-z].*/, {
    message: 'Password must contain at least one lowercase letter',
  })
  bpassword?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePhoneDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^01\d+$/, {
    message: 'Phone number must start with "01" and contain only digits',
  })
  phone: string;
}
