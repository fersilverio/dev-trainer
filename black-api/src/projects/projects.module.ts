import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsMicroserviceController } from './projects-microservice.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaProjectsRepository } from './repositories/prisma/prisma-projects.repository';

@Module({
  controllers: [ProjectsMicroserviceController],
  providers: [
    ProjectsService,
    PrismaService,
    {
      provide: "ProjectsRepository",
      useFactory: (prisma: PrismaService) => {
        return new PrismaProjectsRepository(prisma);
      },
      inject: [PrismaService],
    }
  ],
})
export class ProjectsModule { }
