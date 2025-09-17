import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AdminEntity } from '../admin/admin.entity';

@Entity('super_admin')
export class SuperAdminEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 100 })
	@IsNotEmpty()
	@IsString()
	name: string;

	@Column({ type: 'varchar', length: 150, unique: true })
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@OneToMany(() => AdminEntity, (admin) => admin.superAdmin)
	admins: AdminEntity[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
} 