import {Column,Entity,PrimaryGeneratedColumn} from 'typeorm';
import {IsEmail,IsNotEmpty,IsString,Matches,MinLength,IsInt,Min,IsIn} from 'class-validator';

@Entity('seller')
export class SellerEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message:
      'Name must only contain letters and spaces (no numbers allowed)',
  })
  name: string;

  @Column({ type: 'int', unsigned: true })
  @IsInt()
  @Min(0, { message: 'Age must be a positive number' })
  age: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{13}$|^\d{17}$/, {
    message: 'NID number must be exactly 13 or 17 digits',
  })
  nidNumber: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  nidImage: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/.*[@#$&].*/, {
    message:
      'Password must contain at least one special character (@, #, $, or &)',
  })
  password: string;

  @Column({ type: 'varchar', length: 10, default: 'active' })
  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })
  status: string;

  
}
