import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Feature } from './tasks.types';
import { CreateKanbanColumnDto } from './dtos/create-kanban-column.dto';

@Controller()
export class TasksMicroserviceController {
  private logger = new Logger(TasksMicroserviceController.name);

  constructor(private readonly tasksService: TasksService) { }

  @MessagePattern('BLACKAPI.GET.KANBAN.COLUMN.DEFINITIONS')
  async getProjectColumnDefinitions() {
    try {
      const columns = await this.tasksService.getProjectColumnDefinitions();
      return { status: HttpStatus.OK, data: columns };
    } catch (error) {
      this.logger.error('Error fetching project column definitions', error);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to fetch project column definitions.', error: error.message };
    }
  }

  @MessagePattern('BLACKAPI.SAVE.KANBAN.COLUMN')
  async saveKanbanColumn(@Payload() data: CreateKanbanColumnDto) {
    try {
      await this.tasksService.saveKanbanColumn(data);
      return { status: HttpStatus.CREATED, message: 'Kanban column saved successfully.' };
    } catch (error) {
      this.logger.error('Error saving Kanban column', error);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to save Kanban column.', error: error.message };
    }
  }

  @MessagePattern('BLACKAPI.SAVE.KANBAN.BOARD')
  async saveKanbanBoard() {
    try {
      const result = await this.tasksService.saveKanbanBoard();
      return { status: HttpStatus.CREATED, message: 'Kanban board saved successfully.', data: result };
    } catch (error) {
      this.logger.error('Error saving Kanban board', error);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to save Kanban board.', error: error.message };
    }
  }

  @MessagePattern('BLACKAPI.SAVE.TASK.STRUCTURE')
  async saveTaskStructure(@Payload() featureSet: Feature[]) {
    try {
      await this.tasksService.saveTasks(featureSet);
      return { status: HttpStatus.CREATED, message: 'Task structure saved successfully.' };
    } catch (error) {
      this.logger.error('Error saving task structure', error);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to save task structure.', error: error.message };
    }
  }
}
