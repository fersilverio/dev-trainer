import { Feature, KanbanBoardRegistry } from "src/tasks/tasks.types";
import { TasksRepository } from "../tasks.repository";
import { PrismaService } from "prisma/prisma.service";
import { CreateKanbanColumnDto } from "src/tasks/dtos/create-kanban-column.dto";
import { BadRequestException } from "@nestjs/common";

export class PrismaTasksRepository implements TasksRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getProjectColumnDefinitions(): Promise<KanbanBoardRegistry[] | any> {

        const columnDefinitions = await this.prisma.kanbanBoard.findMany({
            where: { projectId: 2 }, // projectId is static for now
            include: {
                kanbanColumn: true,
                task: true
            },
        });




        // precisa de um preparo pra enviar pro front
        // tem que retornar por coluna ai para cada coluna vai ser 
        // o id, o nome e os cards, os cards vao ser os kanbanboardregistry

        return columnDefinitions;
    }

    async saveKanbanColumn(data: CreateKanbanColumnDto) {

        const currentLastColumnPosition = await this.prisma.kanbanColumn.count({
            where: { projectId: data.projectId } // projectId is static for now
        });

        await this.prisma.kanbanColumn.create({
            data: {
                name: data.name,
                position: currentLastColumnPosition + 1,
                projectId: data.projectId,
            }
        });
    }

    async saveKanbanBoard() {
        const columnId = await this.prisma.kanbanColumn.findFirst({
            select: {
                id: true
            },
            where: {
                projectId: 2, // projectId is static for now
                position: 1
            },
        });

        if (!columnId) {
            throw new BadRequestException("No kanban column found for the project.");
        } else {
            const projectFeatures = await this.prisma.feature.findMany({
                where: { projectId: 2 }, // projectId is static for now
                include: {
                    Task: true
                }
            });

            let positionAtColumnCounter = 0;

            for (const feature of projectFeatures) {
                const tasks = feature.Task;

                await this.prisma.kanbanBoard.createMany({
                    data: tasks.map((task, index) => ({
                        projectId: 2, // projectId is static for now
                        taskId: task.id,
                        columnId: columnId.id,
                        orderAtColumn: positionAtColumnCounter + 1,
                    }))
                });
            }

            await this.setInitialPositionsAtColumn();
        }
    }

    async saveTasks(featureSet: Feature[]) {
        for (const feature of featureSet) {
            const title = feature.title;
            const tasks = feature.tasks;

            const featureEntity = await this.prisma.feature.create({
                data: {
                    title,
                    projectId: 2 // projectId is static for now
                }
            });

            await this.prisma.task.createMany({
                data: tasks.map(task => {
                    return {
                        title: task.title,
                        deliverableExplanation: task.deliverable_explanation,
                        technicalBackendDescription: task.technical_backend_description,
                        technicalFrontendDescription: task.technical_frontend_description,
                        featureId: featureEntity.id,
                        priority: task.priority ?? 3, // Default priority if not provided
                        deadline: new Date(task.deadline) ?? null, // Default to null if not provided
                    };
                })
            });
        }
    }

    private async setInitialPositionsAtColumn() {
        const firstProjectColumn = await this.prisma.kanbanBoard.findMany({
            where: { columnId: 1, projectId: 2 }, // Assuming we want to update the first kanban board
        });

        let initialPositionAtColumn = 0;

        for (const element of firstProjectColumn) {
            await this.prisma.kanbanBoard.update({
                where: { id: element.id },
                data: { orderAtColumn: ++initialPositionAtColumn }
            });
        }
    }
}