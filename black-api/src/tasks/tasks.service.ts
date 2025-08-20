import { Inject, Injectable } from '@nestjs/common';
import { Feature } from './tasks.types';
import { TasksRepository } from './repositories/tasks.repository';
import { CreateKanbanColumnDto } from './dtos/create-kanban-column.dto';
import { ReorderKanbanColumnDto } from './dtos/reorder-kanban-column.dto';

@Injectable()
export class TasksService {
    @Inject("TasksRepository")
    private tasksRepository: TasksRepository;

    async reorderKanbanColumn(data: ReorderKanbanColumnDto) {
        return this.tasksRepository.reorderKanbanColumn(data);
    }

    async getProjectColumnDefinitions(projectId: number) {
        return this.tasksRepository.getProjectColumnDefinitions(projectId);
    }

    async getProjectKanbanColumns(projectId: number) {
        return this.tasksRepository.getProjectKanbanColumns(projectId);
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
