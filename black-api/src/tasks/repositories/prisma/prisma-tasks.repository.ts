import { FeatureSet } from "src/tasks/tasks.types";
import { TasksRepository } from "../tasks.repository";
import { PrismaService } from "prisma/prisma.service";

export class PrismaTasksRepository implements TasksRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(featureSet: FeatureSet) {
        // TODO - Adapt it to all features in the featureSet
        const featureTitle = featureSet[0].title;
        const featureTasks = featureSet[0].tasks;

        const feature = await this.prisma.feature.create({
            data: {
                title: featureTitle,
                projectId: 2
            }
        });

        await this.prisma.task.createMany({
            data: featureTasks.map(task => {
                return {
                    title: task.title,
                    deliverableExplanation: task.deliverable_explanation,
                    technicalBackendDescription: task.technical_backend_description,
                    technicalFrontendDescription: task.technical_frontend_description,
                    featureId: feature.id,
                    priority: task.priority ?? 3,
                    deadline: new Date(task.deadline) ?? null,
                };
            })
        });


    }

}