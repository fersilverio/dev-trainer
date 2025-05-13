import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CrewTechTeamModule } from './modules/crew-tech-team/crew-tech-team.module';

@Module({
  imports: [UsersModule, CrewTechTeamModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
