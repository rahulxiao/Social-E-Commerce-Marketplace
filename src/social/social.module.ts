import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { FollowEntity } from './follow.entity';
import { ActivityEntity } from './activity.entity';
import { BuyerEntity } from '../buyer/buyer.entity';
import { ProductEntity } from '../product/product.entity';
import { OrderEntity } from '../order/order.entity';
import { ReviewEntity } from '../review/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FollowEntity,
      ActivityEntity,
      BuyerEntity,
      ProductEntity,
      OrderEntity,
      ReviewEntity,
    ]),
  ],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
