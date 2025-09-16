import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;
}

export class CartResponseDto {
  id: number;
  totalAmount: number;
  totalItems: number;
  isActive: boolean;
  cartItems: CartItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class CartItemResponseDto {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: number;
    title: string;
    price: number;
    stock: number;
    inStock: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
