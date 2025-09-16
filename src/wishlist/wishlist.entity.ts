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

@Entity('wishlist')
@Unique(['buyer', 'product'])
export class WishlistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes?: string;

  // Relationship: Many WishlistItems belong to one Buyer
  @ManyToOne(() => BuyerEntity, (buyer) => buyer.wishlistItems, {
    onDelete: 'CASCADE',
  })
  buyer: BuyerEntity;

  // Relationship: Many WishlistItems belong to one Product
  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
