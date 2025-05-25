import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CrewTechTeamModule } from './modules/crew-tech-team/crew-tech-team.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(

      {
        isGlobal: true,
        envFilePath: '.env'
      }
    ),
    UsersModule,
    CrewTechTeamModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
