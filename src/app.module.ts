import { Module } from "@nestjs/common";
import { AdminController } from "./admin/admin.controller";
import { AdminService } from "./admin/admin.services";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.services";
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { OrderController } from "./order/order.controller";
import { OrderModule } from './order/order.module';
import { CartModule } from "./cart/cart.module";
import { OrderService } from "./order/order.service";
import { AdminModule } from "./admin/admin.module";
import { CartController } from "./cart/cart.controller";
import { CartService } from "./cart/cart.service";
import { UserModule } from "./user/user.module";

@Module({
  imports: [ProductModule, CartModule, OrderModule,AdminModule,UserModule],
  controllers: [AdminController,UserController,OrderController,CartController,ProductController],
  providers: [AdminService, UserService,OrderService,CartService,ProductService],
})
export class AppModule {}