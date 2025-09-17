import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuperAdminEntity } from './superadmin.entity';
import { CreateSuperAdminDto, UpdateSuperAdminDto } from './superadmin.dto';
import { AdminEntity } from '../admin/admin.entity';

@Injectable()
export class SuperAdminService {
	constructor(
		@InjectRepository(SuperAdminEntity)
		private readonly superAdminRepository: Repository<SuperAdminEntity>,
		@InjectRepository(AdminEntity)
		private readonly adminRepository: Repository<AdminEntity>,
	) {}

	async create(dto: CreateSuperAdminDto) {
		const entity = this.superAdminRepository.create(dto);
		const saved = await this.superAdminRepository.save(entity);
		return { success: true, message: 'SuperAdmin created', data: saved };
	}

	async findAll() {
		const list = await this.superAdminRepository.find({ relations: ['admins'] });
		return { success: true, message: 'SuperAdmins fetched', count: list.length, data: list };
	}

	async findOne(id: number) {
		const found = await this.superAdminRepository.findOne({ where: { id }, relations: ['admins'] });
		if (!found) throw new NotFoundException('SuperAdmin not found');
		return { success: true, message: 'SuperAdmin fetched', data: found };
	}

	async update(id: number, dto: UpdateSuperAdminDto) {
		const result = await this.superAdminRepository.update(id, dto);
		if (!result.affected) throw new NotFoundException('SuperAdmin not found');
		const updated = await this.superAdminRepository.findOne({ where: { id }, relations: ['admins'] });
		return { success: true, message: 'SuperAdmin updated', data: updated };
	}

	async remove(id: number) {
		const result = await this.superAdminRepository.delete(id);
		if (!result.affected) throw new NotFoundException('SuperAdmin not found');
		return { success: true, message: 'SuperAdmin deleted' };
	}

	async assignAdmin(superAdminId: number, adminId: number) {
		const superAdmin = await this.superAdminRepository.findOne({ where: { id: superAdminId } });
		if (!superAdmin) throw new NotFoundException('SuperAdmin not found');
		const admin = await this.adminRepository.findOne({ where: { id: adminId } });
		if (!admin) throw new NotFoundException('Admin not found');
		admin.superAdmin = superAdmin;
		await this.adminRepository.save(admin);
		return { success: true, message: 'Admin assigned to SuperAdmin' };
	}

	async removeAdmin(superAdminId: number, adminId: number) {
		const admin = await this.adminRepository.findOne({ where: { id: adminId }, relations: ['superAdmin'] });
		if (admin?.superAdmin?.id !== superAdminId) {
			throw new NotFoundException('Relation not found');
		}
		admin.superAdmin = null;
		await this.adminRepository.save(admin);
		return { success: true, message: 'Admin removed from SuperAdmin' };
	}
} 