import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @EventPattern('tasks-created')
  async handleTasksCreated(data) {
    return await this.schedulerService.handleCron(data);
  }
}
