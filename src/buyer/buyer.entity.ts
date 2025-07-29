import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MinLength, IsOptional, IsDateString } from "class-validator";

@Entity('buyer')
export class BuyerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must only contain letters and spaces (no numbers allowed)',
    })
    bname: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @IsEmail()
    @IsNotEmpty()
    bemail: string;

    @Column({ type: 'varchar', length: 20 })
    @IsNotEmpty()
    @IsString()
    @Matches(/^01\d+$/, {
    message: 'Phone number must start with "01" and contain only digits',
    })
    bphone: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    @IsNotEmpty()
    @IsString()
    busername: string;

    
    @Column({ type: 'varchar', length: 255 })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/.*[a-z].*/, {
    message: 'Password must contain at least one lowercase letter',
    })
    @Matches(/.*[@#$&].*/, {
    message: 'Password must contain at least one special character (@, #, $, or &)',
    })
    bpassword: string;

    
}