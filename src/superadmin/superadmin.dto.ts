import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSuperAdminDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;
}

export class UpdateSuperAdminDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsEmail()
	email?: string;
} 