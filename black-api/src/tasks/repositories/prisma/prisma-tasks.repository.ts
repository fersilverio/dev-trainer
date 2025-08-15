import { Feature, KanbanBoardRegistry, TasksFromProjectInfo } from "src/tasks/tasks.types";
import { TasksRepository } from "../tasks.repository";
import { PrismaService } from "prisma/prisma.service";
import { CreateKanbanColumnDto } from "src/tasks/dtos/create-kanban-column.dto";
import { BadRequestException } from "@nestjs/common";
import { ReorderKanbanColumnDto } from "src/tasks/dtos/reorder-kanban-column.dto";
import { KanbanColumn, Prisma } from "@prisma/client";

export class PrismaTasksRepository implements TasksRepository {
    constructor(private readonly prisma: PrismaService) { }

    async reorderKanbanColumn(data: ReorderKanbanColumnDto): Promise<void> {
        return this.prisma.$transaction(async (prisma) => {
            const { columnId, newOrderArray } = data;

            let position = 0

            for (const element of newOrderArray) {
                const kanbanBoardEntry = await prisma.kanbanBoard.findUnique({
                    where: {
                        taskId: element.taskId
                    }
                });

                if (!kanbanBoardEntry) {
                    throw new BadRequestException(`Task with ID ${element.taskId} not found in column ${columnId}.`);
                }

                await prisma.kanbanBoard.update({
                    where: { id: kanbanBoardEntry.id },
                    data: {
                        orderAtColumn: ++position,
                        columnId: +columnId
                    },
                });
            }
        });
    }

    async getProjectColumnDefinitions(projectId: number): Promise<{ filledColumnsDefinitions: KanbanBoardRegistry[], emptyColumns: KanbanColumn[] } | any> {

        const emptyColumns = await this.prisma.$queryRaw(Prisma.sql`
            SELECT
                kc.id,
                kc.name,
                kc.position,
                kc.projectId
            FROM kanbanColumns kc
            LEFT JOIN kanbanBoards kb ON kb.columnId = kc.id
            WHERE
                kc.projectId = ${projectId} AND
                kc.id NOT IN (SELECT columnId FROM kanbanBoards kb GROUP BY columnId)
        `) as KanbanColumn[];

        const mappedEmptyColumns = emptyColumns.map(column => ({
            columnId: column.id,
            name: column.name,
            position: column.position,
            projectId: column.projectId,
            cards: []
        }));

        const columnDefinitions = await this.prisma.kanbanBoard.findMany({
            where: { projectId },
            include: {
                kanbanColumn: true,
                task: {
                    include: {
                        feature: true
                    }
                },
            },
            orderBy: {
                orderAtColumn: 'asc'
            }
        });

        return {
            filledColumnsDefinitions: columnDefinitions,
            emptyColumns: mappedEmptyColumns
        };
    }

    async saveKanbanColumn(data: CreateKanbanColumnDto) {

        const currentLastColumnPosition = await this.prisma.kanbanColumn.count({
            where: { projectId: data.projectId }
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
        const firstProjectColumn = await this.prisma.kanbanColumn.findFirst({
            select: {
                id: true
            },
            where: {
                projectId: 2, // projectId is static for now
            },
            orderBy: {
                position: 'asc'
            },
            take: 1
        });

        if (!firstProjectColumn) {
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
                        columnId: firstProjectColumn.id,
                        orderAtColumn: positionAtColumnCounter + 1,
                    }))
                });
            }

            await this.setInitialPositionsAtColumn(firstProjectColumn.id);
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

    async getInfoAboutProjectTasks(projectId: number): Promise<TasksFromProjectInfo | undefined> {
        const tasksFromProject = await this.prisma.taskProject.findMany({
            where: { projectId },
            select: {
                taskId: true,
            },
        });

        const lastKanbanColumn = await this.prisma.kanbanColumn.findMany({
            select: {
                id: true,
            },
            where: { projectId },
            orderBy: { position: 'desc' },
            take: 1,
        });

        if (lastKanbanColumn.length > 0) {
            let numberOfFinishedTasks = 0;
            const lastColumnId = lastKanbanColumn[0].id;

            numberOfFinishedTasks = await this.prisma.kanbanBoard.count({
                where: {
                    columnId: lastColumnId,
                    projectId,
                },
            });

            const numberOfTasks = tasksFromProject.length;

            return {
                numberOfTasks,
                numberOfFinishedTasks,
            };
        } else {
            return {
                numberOfTasks: 0,
                numberOfFinishedTasks: 0,
            };
        }
    }

    private async setInitialPositionsAtColumn(fisrtColumnId: number) {
        const firstProjectColumnElements = await this.prisma.kanbanBoard.findMany({
            where: { columnId: fisrtColumnId, projectId: 2 }, // Assuming we want to update the first kanban board
        });

        let initialPositionAtColumn = 0;

        for (const element of firstProjectColumnElements) {
            await this.prisma.kanbanBoard.update({
                where: { id: element.id },
                data: { orderAtColumn: ++initialPositionAtColumn }
            });
        }
    }
}