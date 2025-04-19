import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersMicroserviceController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaUsersRepository } from './repositories/prisma-users.repository';

@Module({
  controllers: [UsersMicroserviceController],
  providers: [
    UsersService, 
    PrismaService,
    {
      provide: "UsersRepository",
      useFactory: (prisma: PrismaService) => {
        return new PrismaUsersRepository(prisma);
      },
      inject: [PrismaService],
    }
  ],
})
export class UsersModule { }
