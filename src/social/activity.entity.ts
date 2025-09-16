import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { BuyerEntity } from '../buyer/buyer.entity';
import { ProductEntity } from '../product/product.entity';
import { OrderEntity } from '../order/order.entity';
import { ReviewEntity } from '../review/review.entity';

export enum ActivityType {
  PURCHASE = 'purchase',
  REVIEW = 'review',
  WISHLIST_ADD = 'wishlist_add',
  FOLLOW = 'follow',
}

@Entity('activity')
export class ActivityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: any; // Store additional data like product details, review rating, etc.

  // Relationship: Many Activities belong to one Buyer
  @ManyToOne(() => BuyerEntity, (buyer) => buyer.activities, {
    onDelete: 'CASCADE',
  })
  buyer: BuyerEntity;

  // Optional relationships for different activity types
  @ManyToOne(() => ProductEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  product: ProductEntity;

  @ManyToOne(() => OrderEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  order: OrderEntity;

  @ManyToOne(() => ReviewEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  review: ReviewEntity;

  @CreateDateColumn()
  createdAt: Date;
}
