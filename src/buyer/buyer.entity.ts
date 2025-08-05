import {Column,Entity,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,BeforeInsert,} from 'typeorm';
import {IsEmail,IsNotEmpty,IsString, Matches,MinLength,IsOptional,IsBoolean,} from 'class-validator';

@Entity('buyer')
export class BuyerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Full name must only contain letters and spaces (no numbers allowed)',
  })
  fullName: string;

  @Column({ type: 'varchar', length: 20 })
  @IsNotEmpty()
  @IsString()
  @Matches(/^01\d+$/, {
    message: 'Phone number must start with "01" and contain only digits',
  })
  phone: string;

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
    // Custom ID generation logic
    this.id = Date.now() + Math.floor(Math.random() * 1000);
  }
}
