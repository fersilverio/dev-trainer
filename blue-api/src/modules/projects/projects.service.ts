import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { NatsService } from 'src/infrastructure/nats-client/nats.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly natsService: NatsService) { }

  async create(createProjectDto: CreateProjectDto) {
    return this.natsService.sendMessage('BLACKAPI.SAVE.PROJECT', createProjectDto);
  }

  async findAll() {
    return this.natsService.sendMessage('BLACKAPI.GET.ALL.PROJECTS', {});
  }

  async findOne(id: number) {
    return this.natsService.sendMessage('BLACKAPI.GET.PROJECT', id);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.natsService.sendMessage('BLACKAPI.UPDATE.PROJECT', { id, ...updateProjectDto });
  }

  async remove(id: number) {
    return this.natsService.sendMessage('BLACKAPI.DELETE.PROJECT', id);
  }
}
