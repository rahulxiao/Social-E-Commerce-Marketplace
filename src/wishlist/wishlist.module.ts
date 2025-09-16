import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { WishlistEntity } from './wishlist.entity';
import { ProductEntity } from '../product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishlistEntity, ProductEntity]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
