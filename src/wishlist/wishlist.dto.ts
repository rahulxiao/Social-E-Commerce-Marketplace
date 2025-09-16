import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class AddToWishlistDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  notes?: string;
}

export class UpdateWishlistItemDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  notes?: string;
}

export class WishlistItemResponseDto {
  id: number;
  notes?: string;
  product: {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    inStock: boolean;
    seller: {
      id: number;
      name: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export class WishlistResponseDto {
  items: WishlistItemResponseDto[];
  totalItems: number;
}
