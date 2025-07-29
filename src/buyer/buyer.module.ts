import { Module } from '@nestjs/common';
import { UserController } from './buyer.controller';
import { UserService } from './buyer.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerEntity } from './buyer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BuyerEntity])],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
