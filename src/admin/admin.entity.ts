import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@Entity('admin')
export class AdminEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty()
    @IsString()
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column({ type: 'varchar', length: 20 })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @Column({ type: 'text' })
    @IsNotEmpty()
    @IsString()
    address: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    @IsNotEmpty()
    @IsString()
    username: string;

    @Column({ type: 'varchar', length: 50, default: 'admin' })
    @IsNotEmpty()
    @IsString()
    role: string;

    @Column({ type: 'varchar', length: 255 })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}