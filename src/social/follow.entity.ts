import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { BuyerEntity } from '../buyer/buyer.entity';

@Entity('follow')
@Unique(['follower', 'following'])
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Relationship: Many Follows belong to one Follower (Buyer)
  @ManyToOne(() => BuyerEntity, (buyer) => buyer.following, {
    onDelete: 'CASCADE',
  })
  follower: BuyerEntity;

  // Relationship: Many Follows belong to one Following (Buyer)
  @ManyToOne(() => BuyerEntity, (buyer) => buyer.followers, {
    onDelete: 'CASCADE',
  })
  following: BuyerEntity;

  @CreateDateColumn()
  createdAt: Date;
}
