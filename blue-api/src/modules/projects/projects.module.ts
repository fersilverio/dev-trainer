import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { NatsClientModule } from 'src/infrastructure/nats-client/nats.module';

@Module({
  imports: [NatsClientModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule { }
