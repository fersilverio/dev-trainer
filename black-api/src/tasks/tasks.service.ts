import { Inject, Injectable } from '@nestjs/common';
import { Feature } from './tasks.types';
import { TasksRepository } from './repositories/tasks.repository';
import { CreateKanbanColumnDto } from './dtos/create-kanban-column.dto';

@Injectable()
export class TasksService {
    @Inject("TasksRepository")
    private tasksRepository: TasksRepository;

    async getProjectColumnDefinitions() {
        return this.tasksRepository.getProjectColumnDefinitions();
    }

    async saveKanbanColumn(data: CreateKanbanColumnDto) {
        return this.tasksRepository.saveKanbanColumn(data);
    }

    async saveKanbanBoard() {
        return this.tasksRepository.saveKanbanBoard();
    }

    async saveTasks(featureSet: Feature[]) {
        return this.tasksRepository.saveTasks(featureSet);
    }
}
