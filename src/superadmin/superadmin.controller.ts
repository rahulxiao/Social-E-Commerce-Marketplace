import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SuperAdminService } from './superadmin.service';
import { CreateSuperAdminDto, UpdateSuperAdminDto } from './superadmin.dto';

@Controller('superadmin')
export class SuperAdminController {
	constructor(private readonly superAdminService: SuperAdminService) {}

	@Post()
	create(@Body() dto: CreateSuperAdminDto) {
		return this.superAdminService.create(dto);
	}

	@Get()
	findAll() {
		return this.superAdminService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.superAdminService.findOne(id);
	}

	@Put(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSuperAdminDto) {
		return this.superAdminService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.superAdminService.remove(id);
	}

	@Put(':id/assign-admin/:adminId')
	assignAdmin(
		@Param('id', ParseIntPipe) id: number,
		@Param('adminId', ParseIntPipe) adminId: number,
	) {
		return this.superAdminService.assignAdmin(id, adminId);
	}

	@Put(':id/remove-admin/:adminId')
	removeAdmin(
		@Param('id', ParseIntPipe) id: number,
		@Param('adminId', ParseIntPipe) adminId: number,
	) {
		return this.superAdminService.removeAdmin(id, adminId);
	}

	
} 