import { Injectable } from "@nestjs/common";
import { CreateKanbanColumnDto } from "./dtos/create-kanban-column.dto";
import { NatsService } from "src/infrastructure/nats-client/nats.service";
import { ReorderKanbanColumnDto } from "./dtos/reorder-kanban-column.dto";

@Injectable()
export class TasksService {
    constructor(
        private readonly natsService: NatsService,
    ) { }

    async getKanbanColumnDefinitions(projectId: string) {
        const response = this.natsService.sendMessage('BLACKAPI.GET.KANBAN.COLUMN.DEFINITIONS', projectId);
        return response;
    }

    async getProjectKanbanColumns(projectId: string) {
        const response = this.natsService.sendMessage('BLACKAPI.GET.PROJECT.KANBAN.COLUMNS', projectId);
        return response;
    }

    async createKanbanBoard() {
        const response = this.natsService.sendMessage('BLACKAPI.SAVE.KANBAN.BOARD', {});
        return response;
    }

    async createKanbanColumn(data: CreateKanbanColumnDto) {
        const response = this.natsService.sendMessage('BLACKAPI.SAVE.KANBAN.COLUMN', data);
        return response;
    }

    async reorderKanbanColumn(data: ReorderKanbanColumnDto) {
        const response = this.natsService.sendMessage('BLACKAPI.REORDER.KANBAN.COLUMN', data);
        return response;
    }
}