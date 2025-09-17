import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ReviewModule } from './review/review.module';
import { SocialModule } from './social/social.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BuyerModule } from './buyer/buyer.module';
import { SellerModule } from './seller/seller.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomMailerModule } from './mailer/mailer.module';

import { SuperAdminModule } from './superadmin/superadmin.module';
// import { EmailModule } from './email/email.module'; // Uncomment when enabling email

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'rahulxiao',
      database: 'trendora',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    ProductModule,
    CartModule,
    OrderModule,
    WishlistModule,
    ReviewModule,
    SocialModule,
    // EmailModule,
    AdminModule,
    BuyerModule,
    SellerModule,
    SuperAdminModule,
    CustomMailerModule,
  ],
})
export class AppModule {}
