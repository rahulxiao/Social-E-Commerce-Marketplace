import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
// Note: CartEntity is imported via string reference to avoid circular imports
import { ProductEntity } from '../product/product.entity';

@Entity('cart_item')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  // Relationship: Many CartItems belong to one Cart
  @ManyToOne('CartEntity', 'cartItems', {
    onDelete: 'CASCADE',
  })
  cart: any;

  // Relationship: Many CartItems belong to one Product
  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
