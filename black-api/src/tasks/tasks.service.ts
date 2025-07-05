import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Feature, FeatureSet } from './tasks.types';
import { TasksRepository } from './repositories/tasks.repository';

@Injectable()
export class TasksService {
    @Inject("TasksRepository")
    private tasksRepository: TasksRepository;

    async save(featureSet: Feature[]) {
        await this.tasksRepository.save(featureSet);
    }
}
