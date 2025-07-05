import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Feature, FeatureSet } from './tasks.types';

@Controller()
export class TasksMicroserviceController {
  private logger = new Logger(TasksMicroserviceController.name);

  constructor(private readonly tasksService: TasksService) { }

  @MessagePattern({ cmd: 'BLACKAPI.SAVE.TASK.STRUCTURE' })
  async saveTaskStructure(@Payload() featureSet: Feature[]) {
    try {
      await this.tasksService.save(featureSet);
      return { status: HttpStatus.CREATED, message: 'Task structure saved successfully.' };
    } catch (error) {
      this.logger.error('Error saving task structure', error);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to save task structure.', error: error.message };
    }
  }
}
