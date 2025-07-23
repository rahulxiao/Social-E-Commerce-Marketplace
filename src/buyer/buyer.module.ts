import { Module } from '@nestjs/common';
import { UserController } from './buyer.controller';
import { UserService } from './buyer.services';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
