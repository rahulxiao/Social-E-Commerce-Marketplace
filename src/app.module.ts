import { Module } from "@nestjs/common";
import { AdminController } from "./admin/admin.controller";
import { AdminService } from "./admin/admin.services";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.services";

@Module({
  imports: [],
  controllers: [AdminController,UserController],
  providers: [AdminService, UserService],
})
export class AppModule {}