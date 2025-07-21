import { CreateProjectDto } from "src/projects/dto/create-project.dto";
import { UpdateProjectDto } from "src/projects/dto/update-project.dto";
import { Project } from "src/projects/entities/project.entity";
import { ProjectsRepository } from "../projects.repository";
import { PrismaService } from "prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";

export class PrismaProjectsRepository implements ProjectsRepository {
    constructor(private prisma: PrismaService) { }

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

    async findAll(): Promise<Project[]> {
        return this.prisma.project.findMany();
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