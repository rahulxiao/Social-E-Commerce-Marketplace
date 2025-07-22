import { Body, Controller, Delete, Param, Post, Query } from "@nestjs/common";
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
        return this.adminService.deleteAdmin();         
    }
    @Delete('deleteAdminById/:id')
    deleteAdminById(@Param('id') id: string) {
        return this.adminService.deleteAdminById(id);
    }
    //Test endpoint to check if the controller is working
     // This endpoint adds an admin body with name and id
    @Post('addAdminBody')
    addAdminBody(@Body('name') name: string, @Body('id') id: number) {
        return this.adminService.addAdminBody(name, id);
    }
    // This endpoint retrieves admin information based on name and id
    @Get('getAdminInfoByNameAndId')
    getAdminByNameAndId(@Query('name') name: string, @Query('id') id: number) {
        return this.adminService.getAdminByNameAndId(name, id);
    }
}