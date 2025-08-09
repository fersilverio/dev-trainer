import { CreateProjectDto } from "../dto/create-project.dto";
import { UpdateProjectDto } from "../dto/update-project.dto";
import { Project } from "../entities/project.entity";

export interface ProjectsRepository {
    create(createProjectDto: CreateProjectDto): Promise<Project>;
    findAll();
    findOne(id: number): Promise<Project>;
    update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(id: number): Promise<Project>;
}