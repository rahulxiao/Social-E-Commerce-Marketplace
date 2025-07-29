import { Module } from '@nestjs/common';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerEntity } from './buyer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BuyerEntity])],
    controllers: [BuyerController],
    providers: [BuyerService],
})
export class BuyerModule {}
