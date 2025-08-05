import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn,UpdateDateColumn,} from 'typeorm';
import {IsEmail, IsNotEmpty, IsString, Matches, MinLength, IsOptional, IsDateString,} from 'class-validator';

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
  @Matches(/.*[@#$&].*/, {
    message:
      'Password must contain at least one special character (@, #, $, or &)',
  })
  password: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @Matches(
    /^https?:\/\/(www\.)?(facebook|twitter|linkedin|github)\.com\/[a-zA-Z0-9_\-./]+$/,
    {
      message: 'Only Facebook, Twitter, LinkedIn, or GitHub URLs are allowed',
    },
  )
  socialMediaLink?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
