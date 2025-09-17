import { IsNotEmpty, IsEmail, IsString, IsOptional, IsDateString, Matches, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must only contain letters and spaces (no numbers allowed)',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must only contain letters, numbers, and underscores (no special characters allowed)',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^https:\/\/(github\.com|facebook\.com|linkedin\.com|twitter\.com)\/.+/, {
    message: 'Social media link must be a valid GitHub, Facebook, LinkedIn, or Twitter URL',
  })
  socialMediaLink: string;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must only contain letters and spaces (no numbers allowed)',
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must only contain letters, numbers, and underscores (no special characters allowed)',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @Matches(/^https:\/\/(github\.com|facebook\.com|linkedin\.com|twitter\.com)\/.+/, {
    message: 'Social media link must be a valid GitHub, Facebook, LinkedIn, or Twitter URL',
  })
  socialMediaLink?: string;
}

export class UpdateCountryDto {
  @IsNotEmpty()
  @IsString()
  country: string;
}