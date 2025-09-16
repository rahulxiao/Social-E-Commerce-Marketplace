import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewEntity } from './review.entity';
import { ProductEntity } from '../product/product.entity';
import { OrderEntity } from '../order/order.entity';
import { OrderItemEntity } from '../order/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewEntity,
      ProductEntity,
      OrderEntity,
      OrderItemEntity,
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
