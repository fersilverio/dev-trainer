import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksMicroserviceController } from './tasks-microservice.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaTasksRepository } from './repositories/prisma/prisma-tasks.repository';

@Module({
  controllers: [TasksMicroserviceController],
  providers: [TasksService, PrismaService, {
    provide: "TasksRepository",
    useFactory: (prisma: PrismaService) => {
      return new PrismaTasksRepository(prisma);
    },
    inject: [PrismaService],
  }],
})
export class TasksModule { }
