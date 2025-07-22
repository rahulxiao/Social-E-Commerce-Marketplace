import { Module } from "@nestjs/common";
import { AdminController } from "./admin/admin.controller";
import { AdminService } from "./admin/admin.services";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.services";
import { ProductController } from './admin/product.controller';
import { ProductService } from './admin/product.service';

@Module({
  imports: [],
  controllers: [AdminController,UserController, ProductController],
  providers: [AdminService, UserService, ProductService],
})
export class AppModule {}