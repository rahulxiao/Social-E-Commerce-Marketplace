import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminEntity } from './superadmin.entity';
import { SuperAdminService } from './superadmin.service';
import { SuperAdminController } from './superadmin.controller';
import { AdminEntity } from '../admin/admin.entity';

@Module({
	imports: [TypeOrmModule.forFeature([SuperAdminEntity, AdminEntity])],
	controllers: [SuperAdminController],
	providers: [SuperAdminService],
	exports: [SuperAdminService],
})
export class SuperAdminModule {} 