import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { BuyerEntity } from '../buyer/buyer.entity';
import { ProductEntity } from '../product/product.entity';
import { OrderEntity } from '../order/order.entity';

@Entity('review')
@Unique(['buyer', 'product', 'order'])
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean; // True if buyer actually purchased the product

  @Column({ type: 'boolean', default: true })
  isVisible: boolean; // Admin can hide inappropriate reviews

  // Relationship: Many Reviews belong to one Buyer
  @ManyToOne(() => BuyerEntity, (buyer) => buyer.reviews, {
    onDelete: 'CASCADE',
  })
  buyer: BuyerEntity;

  // Relationship: Many Reviews belong to one Product
  @ManyToOne(() => ProductEntity, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  // Relationship: Many Reviews belong to one Order (for verification)
  @ManyToOne(() => OrderEntity, {
    onDelete: 'SET NULL',
  })
  order: OrderEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
