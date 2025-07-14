import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { CreateKanbanColumnDto } from "./dtos/create-kanban-column.dto";

@Injectable()
export class TasksService {
    constructor(
        @Inject('NATS_SERVICE') private readonly nats: ClientProxy
    ) { }

    private async sendMessage(command: string, data: unknown) {
        const response = await firstValueFrom(this.nats.send({ cmd: command }, data));
        return response;
    }

    async getKanbanColumnDefinitions() {
        const response = this.sendMessage('BLACKAPI.GET.KANBAN.COLUMN.DEFINITIONS', {});
        return response;
    }

    async createKanbanBoard() {
        const response = this.sendMessage('BLACKAPI.SAVE.KANBAN.BOARD', {});
        return response;
    }

    async createKanbanColumn(data: CreateKanbanColumnDto) {
        const response = this.sendMessage('BLACKAPI.SAVE.KANBAN.COLUMN', data);
        return response;
    }
}