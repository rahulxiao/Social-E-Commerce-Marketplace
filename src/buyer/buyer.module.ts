import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.services';
import { BuyerEntity } from './buyer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BuyerEntity])],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
