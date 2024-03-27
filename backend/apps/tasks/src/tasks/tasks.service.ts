import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma } from 'prisma-client-tasksDB';
import { PrismaService } from 'libs/common/src/dbConnection.service';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly prisma: PrismaService,
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientKafka,
  ) {}

  async createTasks(data: Prisma.tasksUncheckedCreateInput) {
    try {
      const createdTask = await this.prisma.tasks.create({
        data,
      });
      this.tasksClient.emit('tasks-created', createdTask);
      this.logger.log('Tasks created event successfull');
      return createdTask;
    } catch (error) {
      console.log(error);
      this.logger.error('Error occured while creating tasks');
      throw new InternalServerErrorException(
        'Some error occured while creating task',
        error,
      );
    }
  }
}
