import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';
import { CartEntity } from '../cart/cart.entity';
import { CartItemEntity } from '../cart/cart-item.entity';
import { ProductEntity } from '../product/product.entity';
import { ActivityEntity } from '../social/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      CartEntity,
      CartItemEntity,
      ProductEntity,
      ActivityEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
