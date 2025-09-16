import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BuyerEntity } from '../buyer/buyer.entity';
// Note: CartItemEntity is imported via string reference to avoid circular imports

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'int', default: 0 })
  totalItems: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relationship: One Cart belongs to one Buyer
  @OneToOne(() => BuyerEntity, (buyer) => buyer.carts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  buyer: BuyerEntity;

  // Relationship: One Cart has many CartItems
  @OneToMany('CartItemEntity', 'cart', {
    cascade: true,
  })
  cartItems: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
