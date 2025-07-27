import { Module } from "@nestjs/common";
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CartModule } from "./cart/cart.module";
import { AdminModule } from "./admin/admin.module";

import { UserModule } from "./buyer/buyer.module";

import { SellerModule } from "./seller/seller.module";
import { TypeOrmModule } from "@nestjs/typeorm";

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
    ProductModule, 
    CartModule, 
    OrderModule,
    AdminModule,
    UserModule,
    SellerModule
  ],
  
})
export class AppModule {}