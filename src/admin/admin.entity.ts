import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { IsNotEmpty, IsEmail, IsString, IsOptional, IsDateString, Matches, IsUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

@Entity('admin')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must only contain letters and spaces (no numbers allowed)',
  })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  @IsUUID()
  uniqueId: string;
  

  @Column({ type: 'varchar', length: 100, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 20 })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @Column({ type: 'varchar', length: 200 })
  @IsNotEmpty()
  @IsString()
  address: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must only contain letters, numbers, and underscores (no special characters allowed)',
  })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[@#$&])/, {
    message: 'Password must contain at least one lowercase letter and one special character (@#$&)',
  })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joiningDate: Date;

  @Column({ type: 'varchar', length: 30, default: 'Unknown' })
  @IsOptional()
  @IsString()
  country: string;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 200 })
  @IsNotEmpty()
  @IsString()
  @Matches(/^https:\/\/(github\.com|facebook\.com|linkedin\.com|twitter\.com)\/.+/, {
    message: 'Social media link must be a valid GitHub, Facebook, LinkedIn, or Twitter URL',
  })
  socialMediaLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateUniqueId() {
    this.uniqueId = uuidv4();
  }
}
