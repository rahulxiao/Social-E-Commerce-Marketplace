import {Column,Entity,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,BeforeInsert,} from 'typeorm';
import {IsEmail,IsNotEmpty,IsString, Matches,MinLength,MaxLength,IsOptional,IsBoolean,IsUUID,} from 'class-validator';
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

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must only contain letters and spaces',
  })
  fullName: string;

  @Column({ type: 'varchar', length: 11 })
  @IsNotEmpty()
  @IsString()
  @Matches(/^01\d{9}$/, { message: 'Phone must start with 01 and be 11 digits' })
  phone: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;

  // Optional stored path for uploaded PDF
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  pdfPath?: string | null;

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
