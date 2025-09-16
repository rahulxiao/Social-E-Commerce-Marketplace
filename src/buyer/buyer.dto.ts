import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
  IsBoolean,
  IsUUID,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Simple password match validator
@ValidatorConstraint({ name: 'MatchPassword', async: false })
class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const password = (args.object as any).password;
    return value === password;
  }
  defaultMessage(): string {
    return 'Confirm password must match password';
  }
}

// Validates an uploaded file is a PDF and <= 2MB
@ValidatorConstraint({ name: 'IsPdfFile', async: false })
class IsPdfFileConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (!value) return true; // optional field handled by IsOptional
    const file = value as Express.Multer.File;
    const isPdf = file?.mimetype === 'application/pdf' || /\.pdf$/i.test(file?.originalname || '');
    const maxBytes = 30 * 1024 * 1024;
    const withinLimit = typeof file?.size === 'number' ? file.size <= maxBytes : true;
    return Boolean(isPdf && withinLimit);
  }
  defaultMessage(): string {
    return 'File must be a PDF not larger than 2MB';
  }
}

export class CreateBuyerDto {
  @IsOptional()
  @IsUUID()
  uniqueId?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must only contain letters and spaces',
  })
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^01\d{9}$/, {
    message: 'Phone must start with 01 and be 11 digits',
  })
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Confirm password must be at least 8 characters long' })
  @MaxLength(20)
  @Validate(MatchPasswordConstraint)
  confirmPassword: string;

  @IsOptional()
  @Validate(IsPdfFileConstraint)
  pdf?: Express.Multer.File;

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
    message: 'Full name must only contain letters and spaces',
  })
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^01\d{9}$/, {
    message: 'Phone must start with 01 and be 11 digits',
  })
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @Validate(IsPdfFileConstraint)
  pdf?: Express.Multer.File;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePhoneDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^01\d{9}$/, {
    message: 'Phone must start with 01 and be 11 digits',
  })
  phone: string;
}

export class BuyerLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class BuyerProfileUpdateDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^01\d{9}$/, {
    message: 'Phone must start with 01 and be 11 digits',
  })
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
