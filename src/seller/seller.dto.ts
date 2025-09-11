import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateSellerDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name should only contain alphabets and spaces',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@.*\.(xyz|com)$/, {
    message: 'Email must end with .xyz domain',
  })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{13}$|^\d{17}$/, {
    message: 'NID number must be 13 or 17 digits',
  })
  readonly nidNumber: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  age: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/.*[@#$&].*/, {
    message:
      'Password must contain at least one special character (@, #, $, or &)',
  })
  password: string;

  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  status?: string = 'active';
}

export class UpdateSellerDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must only contain letters and spaces (no numbers allowed)',
  })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/\.xyz$/, {
    message: 'Email must end with .xyz domain',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{13}$|^\d{17}$/, {
    message: 'NID number must be 10 to 17 digits',
  })
  nidNumber?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  age: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/.*[@#$&].*/, {
    message:
      'Password must contain at least one special character (@, #, $, or &)',
  })
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  status: string;
}
