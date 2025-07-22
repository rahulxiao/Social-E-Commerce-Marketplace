import { Module } from "@nestjs/common";
import { AdminController } from "./admin/admin.controller";
import { AdminService } from "./admin/admin.services";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.services";
import { SellerController } from "./seller/seller.controller";
import { SellerService } from "./seller/seller.services";

@Module({
  imports: [],
  controllers: [AdminController,UserController,SellerController],
  providers: [AdminService, UserService,SellerService],
})
export class AppModule {}