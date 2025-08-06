import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  IsBoolean,
  IsUUID,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateBuyerDto {
  @IsOptional()
  @IsUUID()
  uniqueId?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must only contain letters and spaces (no numbers allowed)',
  })
  fullName?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  phone: number;

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
  @IsUUID()
  uniqueId?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must only contain letters and spaces (no numbers allowed)',
  })
  fullName?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  phone?: number;

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
  @IsNumber()
  @IsPositive()
  phone: number;
}
