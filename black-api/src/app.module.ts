import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';


@Module({
  imports: [UsersModule, TasksModule, ProjectsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
