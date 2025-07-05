import { Feature, FeatureSet } from "src/tasks/tasks.types";
import { TasksRepository } from "../tasks.repository";
import { PrismaService } from "prisma/prisma.service";

export class PrismaTasksRepository implements TasksRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(featureSet: Feature[]) {
        for (const feature of featureSet) {
            const title = feature.title;
            const tasks = feature.tasks;

            const featureEntity = await this.prisma.feature.create({
                data: {
                    title,
                    projectId: 2 // Assuming projectId is static for now
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
}