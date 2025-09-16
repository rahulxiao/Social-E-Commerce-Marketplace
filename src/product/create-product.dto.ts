import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export enum ProductCategory {
  SMARTPHONE = 'smartphone',
  BOOKS = 'books',
  GADGETS = 'gadgets',
  LAPTOP = 'laptop',
}

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductCategory, { message: 'Category must be smartphone, books, gadgets, or laptop' })
  category: ProductCategory;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsOptional()
  image?: any; // Multer file
}

// 👇 UpdateProductDto automatically makes all fields optional
export class UpdateProductDto extends PartialType(CreateProductDto) {}
