import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches, IsDateString } from 'class-validator';

export class CreateAdminDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\s]+$/, {
        message: 'Name must only contain letters and spaces (no numbers allowed)',
    })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/.*[@#$&].*/, {
        message: 'Password must contain at least one special character (@, #, $, or &)',
    })
    password: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;
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
    username?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @Matches(/.*[@#$&].*/, {
        message: 'Password must contain at least one special character (@, #, $, or &)',
    })
    password?: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;
}

