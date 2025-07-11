import { Inject, Injectable } from '@nestjs/common';
import { Feature } from './tasks.types';
import { TasksRepository } from './repositories/tasks.repository';

@Injectable()
export class TasksService {
    @Inject("TasksRepository")
    private tasksRepository: TasksRepository;

    async save(featureSet: Feature[]) {
        await this.tasksRepository.save(featureSet);
    }
}
