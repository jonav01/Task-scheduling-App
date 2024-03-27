import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('scheduler')
export class SchedulerController {
  @EventPattern('tasks-created')
  async handleTasksCreated(data) {
    console.log(data);
  }
}
