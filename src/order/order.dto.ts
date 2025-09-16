import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  Length,
} from 'class-validator';
import { OrderStatus } from './order.entity';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class OrderResponseDto {
  id: number;
  orderNumber: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  shippingAddress: string;
  notes: string;
  shippedAt: Date;
  deliveredAt: Date;
  cancelledAt: Date;
  orderItems: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class OrderItemResponseDto {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productTitle: string;
  productCategory: string;
  product: {
    id: number;
    title: string;
    price: number;
    stock: number;
    inStock: boolean;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderHistoryResponseDto {
  orders: OrderResponseDto[];
  totalOrders: number;
  totalAmount: number;
}
