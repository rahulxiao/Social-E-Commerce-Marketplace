import { Controller, Delete, Get, Post } from "@nestjs/common";
import { UserService } from "./user.services";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('getUserInfo')
    getUserInfo() {
        return this.userService.getUserInfo();
    }
    @Post('createUser')
    createUser() {
        return this.userService.createUser();
    }
    @Delete('deleteUser')
    deleteUser() {
        return this.userService.createUser(); 
    }
}