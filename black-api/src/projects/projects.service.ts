import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './repositories/projects.repository';

@Injectable()
export class ProjectsService {
  @Inject("ProjectsRepository")
  private projectsRepository: ProjectsRepository;

  async create(createProjectDto: CreateProjectDto) {
    return this.projectsRepository.create(createProjectDto);
  }

  async findAll() {
    return this.projectsRepository.findAll();
  }

  async findOne(id: number) {
    return this.projectsRepository.findOne(id);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectsRepository.update(id, updateProjectDto);
  }

  async remove(id: number) {
    return this.projectsRepository.remove(id);
  }
}
