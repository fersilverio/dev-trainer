import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsMicroserviceController } from './projects-microservice.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaProjectsRepository } from './repositories/prisma/prisma-projects.repository';
import { TasksModule } from 'src/tasks/tasks.module';
import { TasksRepository } from 'src/tasks/repositories/tasks.repository';

@Module({
  imports: [TasksModule],
  controllers: [ProjectsMicroserviceController],
  providers: [
    ProjectsService,
    PrismaService,
    {
      provide: "ProjectsRepository",
      useFactory: (prisma: PrismaService, tasksRepository: TasksRepository) => {
        return new PrismaProjectsRepository(prisma, tasksRepository);
      },
      inject: [PrismaService, "TasksRepository"],
    },
  ],
})
export class ProjectsModule { }
