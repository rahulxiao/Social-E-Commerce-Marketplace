import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  Get,
  Put,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.services';
import { CreateAdminDto, UpdateAdminDto } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('getAdminInfo')
  async getAdminInfo() {
    return await this.adminService.getAdminInfo();
  }

  @Post('createAdmin')
  async createAdmin(@Body(ValidationPipe) adminData: CreateAdminDto) {
    return await this.adminService.createAdmin(adminData);
  }

  @Delete('deleteAdminById/:id')
  async deleteAdminById(@Param('id') id: string) {
    return await this.adminService.deleteAdminById(id);
  }

  @Get('getAdminById/:id')
  async getAdminById(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.getAdminById(id);
  }

  @Put('updateAdmin/:id')
  async updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateData: UpdateAdminDto,
  ) {
    return await this.adminService.updateAdmin(id, updateData);
  }

  @Post('addAdminBody')
  async addAdminBody(@Body('name') name: string, @Body('id') id: number) {
    return await this.adminService.addAdminBody(name, id);
  }

  @Get('getAdminInfoByNameAndId')
  async getAdminByNameAndId(
    @Query('name') name: string,
    @Query('id') id: number,
  ) {
    return await this.adminService.getAdminByNameAndId(name, id);
  }
}
