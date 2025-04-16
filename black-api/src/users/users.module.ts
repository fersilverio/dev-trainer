import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersMicroserviceController } from './users.controller';

@Module({
  controllers: [UsersMicroserviceController],
  providers: [UsersService],
})
export class UsersModule { }
