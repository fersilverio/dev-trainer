import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CrewTechTeamModule } from './modules/crew-tech-team/crew-tech-team.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    UsersModule,
    CrewTechTeamModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
