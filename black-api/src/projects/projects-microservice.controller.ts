import { Controller, InternalServerErrorException, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller()
export class ProjectsMicroserviceController {
  private logger = new Logger(ProjectsMicroserviceController.name);

  constructor(private readonly projectsService: ProjectsService) { }

  @MessagePattern('BLACKAPI.SAVE.PROJECT')
  async create(@Payload() createProjectDto: CreateProjectDto) {
    try {
      return this.projectsService.create(createProjectDto);
    } catch (err) {
      this.logger.error('Error creating project', err);
      throw new InternalServerErrorException("[BLACK-API] - Could not create new project.");
    }
  }

  @MessagePattern('BLACKAPI.GET.ALL.PROJECTS')
  async findAll() {
    try {
      return this.projectsService.findAll();
    } catch (err) {
      throw new InternalServerErrorException("[BLACK-API] - Could not find projects.");
    }
  }

  @MessagePattern('BLACKAPI.GET.PROJECT')
  async findOne(@Payload() id: number) {
    try {
      return this.projectsService.findOne(id);
    } catch (err) {
      throw new InternalServerErrorException(`[BLACK-API] - Could not find project with id ${id}.`);
    }
  }

  @MessagePattern('BLACKAPI.UPDATE.PROJECT')
  async update(@Payload() updateProjectDto: UpdateProjectDto) {
    try {
      return this.projectsService.update(updateProjectDto.id, updateProjectDto);
    } catch (err) {
      throw new InternalServerErrorException(`[BLACK-API] - Could not update project with id ${updateProjectDto.id}`);
    }
  }

  @MessagePattern('BLACKAPI.DELETE.PROJECT')
  async remove(@Payload() id: number) {
    try {
      return this.projectsService.remove(id);
    } catch (err) {
      throw new InternalServerErrorException(`[BLACK-API] - Could not remove project with id ${id}`);
    }
  }
}
