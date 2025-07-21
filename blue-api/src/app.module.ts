import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CrewTechTeamModule } from './modules/crew-tech-team/crew-tech-team.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    UsersModule,
    CrewTechTeamModule,
    TasksModule,
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
