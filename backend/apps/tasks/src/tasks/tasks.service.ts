import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma-client-tasksDB';
import { PrismaService } from 'libs/common/src/dbConnection.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTasks(data: Prisma.tasksUncheckedCreateInput) {
    return await this.prisma.tasks.create({
      data,
    });
  }
}
