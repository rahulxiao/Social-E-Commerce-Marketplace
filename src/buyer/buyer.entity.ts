import {Column,Entity,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,BeforeInsert,OneToMany,OneToOne,} from 'typeorm';
import {IsEmail,IsNotEmpty,IsString, Matches,MinLength,MaxLength,IsOptional,IsBoolean,IsUUID,} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { CartEntity } from '../cart/cart.entity';
import { OrderEntity } from '../order/order.entity';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { ReviewEntity } from '../review/review.entity';
import { FollowEntity } from '../social/follow.entity';
import { ActivityEntity } from '../social/activity.entity';

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

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  @IsNotEmpty()
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

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  address?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  // Relationship: One Buyer has one Cart
  @OneToOne(() => CartEntity, (cart) => cart.buyer)
  carts: CartEntity;

  // Relationship: One Buyer has many Orders
  @OneToMany(() => OrderEntity, (order) => order.buyer)
  orders: OrderEntity[];

  // Relationship: One Buyer has many WishlistItems
  @OneToMany(() => WishlistEntity, (wishlistItem) => wishlistItem.buyer)
  wishlistItems: WishlistEntity[];

  // Relationship: One Buyer has many Reviews
  @OneToMany(() => ReviewEntity, (review) => review.buyer)
  reviews: ReviewEntity[];

  // Social relationships
  // Relationship: One Buyer follows many Buyers
  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  following: FollowEntity[];

  // Relationship: One Buyer is followed by many Buyers
  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followers: FollowEntity[];

  // Relationship: One Buyer has many Activities
  @OneToMany(() => ActivityEntity, (activity) => activity.buyer)
  activities: ActivityEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    this.uniqueId = uuidv4();
  }
}
