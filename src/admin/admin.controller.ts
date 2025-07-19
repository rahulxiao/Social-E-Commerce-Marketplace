import { Controller, Delete, Post } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { AdminService } from "./admin.services";

@Controller('admin')
export class AdminController {

    constructor(private readonly adminService: AdminService) {}
    @Get('getAdminInfo')
    getAdminInfo() {
        return this.adminService.getAdminInfo();
    }
    @Post('createAdmin')
    createAdmin() {
        return this.adminService.createAdmin();
    }
    @Delete('deleteAdmin')
    deleteAdmin() {
        return this.adminService.createAdmin();         
    }
}