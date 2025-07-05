import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';


@Module({
  imports: [UsersModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
