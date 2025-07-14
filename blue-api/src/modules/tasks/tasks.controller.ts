import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateKanbanColumnDto } from "./dtos/create-kanban-column.dto";

@Controller('tasks')
export class TasksController {
    private logger = new Logger(TasksController.name);

    constructor(private readonly tasksService: TasksService) { }

    @Post('kanban-column-create')
    async createKanbanColumn(@Body() data: CreateKanbanColumnDto) {
        try {
            return await this.tasksService.createKanbanColumn(data);
        } catch (err) {
            if (err instanceof HttpException) {
                this.logger.error(err.message);
                throw err;
            } else {
                throw new HttpException('Kanban column could not be created.', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Post('kanban-board-create')
    async createKanbanBoard() {
        try {
            return await this.tasksService.createKanbanBoard();
        } catch (err) {
            if (err instanceof HttpException) {
                this.logger.error(err.message);
                throw err;
            } else {
                throw new HttpException('Kanban board could not be created.', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get('kanban-column-definitions')
    async getKanbanColumnDefinitions() {
        try {
            return await this.tasksService.getKanbanColumnDefinitions();
        } catch (err) {
            this.logger.error(err.message);
            throw new HttpException('Could not retrieve Kanban column definitions.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}