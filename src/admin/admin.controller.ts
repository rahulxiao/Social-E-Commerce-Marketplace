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
import { CreateAdminDto, UpdateAdminDto, UpdateCountryDto } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // User Category 4 - Required Operations
  @Post('create')
  async createAdmin(@Body(ValidationPipe) adminData: CreateAdminDto) {
    return await this.adminService.createAdmin(adminData);
  }

  @Put('updateCountry/:id')
  async updateCountry(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCountryDto: UpdateCountryDto,
  ) {
    return await this.adminService.updateCountry(id, updateCountryDto);
  }

  @Get('byJoiningDate')
  async getAdminsByJoiningDate(@Query('date') date: string) {
    const joiningDate = new Date(date);
    return await this.adminService.getAdminsByJoiningDate(joiningDate);
  }

  @Get('defaultCountry')
  async getAdminsWithDefaultCountry() {
    return await this.adminService.getAdminsWithDefaultCountry();
  }

  // Additional endpoints for general operations
  @Get('all')
  async getAllAdmins() {
    return await this.adminService.getAllAdmins();
  }

  // Legacy endpoints for compatibility
  @Get('getAdminInfo')
  async getAdminInfo() {
    return await this.adminService.getAdminInfo();
  }

  @Post('createAdmin')
  async createAdminLegacy(@Body(ValidationPipe) adminData: CreateAdminDto) {
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
