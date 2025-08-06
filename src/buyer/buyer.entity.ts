import {Column,Entity,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,BeforeInsert,} from 'typeorm';
import {IsEmail,IsNotEmpty,IsString, Matches,MinLength,IsOptional,IsBoolean,IsUUID,IsNumber,IsPositive,} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

@Entity('buyer')
export class BuyerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  @IsUUID()
  uniqueId: string;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must only contain letters and spaces (no numbers allowed)',
  })
  fullName?: string;

  @Column({ type: 'bigint', unsigned: true })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  phone: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  @IsNotEmpty()
  bemail: string;

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
  bpassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    // Generate UUID for uniqueId field
    this.uniqueId = uuidv4();
    // Custom ID generation logic for numeric id
    this.id = Date.now() + Math.floor(Math.random() * 1000);
  }
}
