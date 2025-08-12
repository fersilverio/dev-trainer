import { CreateProjectDto } from "src/projects/dto/create-project.dto";
import { UpdateProjectDto } from "src/projects/dto/update-project.dto";
import { Project } from "src/projects/entities/project.entity";
import { ProjectsRepository } from "../projects.repository";
import { PrismaService } from "prisma/prisma.service";
import { BadRequestException, Inject } from "@nestjs/common";
import { TasksRepository } from "src/tasks/repositories/tasks.repository";

export class PrismaProjectsRepository implements ProjectsRepository {



    constructor(
        private readonly prisma: PrismaService,
        //@Inject("TasksRepository")
        private readonly tasksRepository: TasksRepository
    ) { }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const newProject = await this.prisma.project.create({
            data: {
                code: createProjectDto.code,
                name: createProjectDto.name,
                description: createProjectDto.description,
                niche: createProjectDto.niche,
                ownerId: createProjectDto.ownerId,
            }
        });

        return newProject;
    }

    async findAll() {
        //const teste = await this.tasksRepository.getProjectColumnDefinitions();
        //console.log(teste);

        return this.prisma.project.findMany({
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                niche: true,
                ownerId: true,
                createdAt: true,
                owner: {
                    select: {
                        name: true,
                    }
                }
            },
        });
    }

    async findOne(id: number): Promise<Project> {
        const project = await this.prisma.project.findUnique({
            where: { id }
        });

        if (!project) {
            throw new BadRequestException(`Project with id ${id} not found`);
        }
        return project;
    }

    async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
        const existingProject = await this.prisma.project.findUnique({
            where: { id }
        });

        if (!existingProject) {
            throw new BadRequestException(`Project with id ${id} not found`);
        }

        const updatedProject = await this.prisma.project.update({
            where: { id },
            data: {
                code: updateProjectDto.code,
                name: updateProjectDto.name,
                description: updateProjectDto.description,
                niche: updateProjectDto.niche,
            }
        });

        return updatedProject;
    }

    async remove(id: number): Promise<Project> {
        const existingProject = await this.prisma.project.findUnique({
            where: { id }
        });

        if (!existingProject) {
            throw new BadRequestException(`Project with id ${id} not found`);
        }

        const deletedProject = await this.prisma.project.delete({
            where: { id }
        });

        return deletedProject;
    }

}