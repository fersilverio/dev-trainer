import { Injectable } from "@nestjs/common";
import { CreateKanbanColumnDto } from "./dtos/create-kanban-column.dto";
import { NatsService } from "src/infrastructure/nats-client/nats.service";

@Injectable()
export class TasksService {
    constructor(
        private readonly natsService: NatsService,
    ) { }

    async getKanbanColumnDefinitions() {
        const response = this.natsService.sendMessage('BLACKAPI.GET.KANBAN.COLUMN.DEFINITIONS', {});
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
}