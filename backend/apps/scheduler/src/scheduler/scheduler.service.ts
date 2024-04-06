import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Prisma, $Enums } from 'prisma-client-tasksDB';
import { PrismaService } from 'libs/common/src';

interface ICreatedTask {
  id: string;
  v: number;
  description: string;
  name: string;
  parameters: string;
  schedule: string;
  status: string;
  type: string;
}

interface ICreatedJob {
  id: string;
  taskId: string;
  taskName: string;
  time: string;
  status: string;
}

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly prisma: PrismaService,
  ) {}

  async handleCron(data: ICreatedTask) {
    // task 1 :- convert the date into cron expression
    const cronDateExpression = this.convertUtcToCronExpression(data.schedule);

    const scheduledJob: ICreatedJob = await this.upsertScheduler(
      data.id,
      {
        time: cronDateExpression,
        status: 'Active',
      },
      {
        taskId: data.id,
        taskName: `dynamicJob-${data.type}-${data.id}`,
        time: cronDateExpression,
        status: 'Active',
      },
    );

    this.addCronJob(
      scheduledJob.taskName,
      cronDateExpression,
      scheduledJob.taskId,
    );
    this.getCrons();
  }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();

    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDate().toUTC();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`realDate: ${value.cronTime.sendAt()} -> next: ${next}`);
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }

  addCronJob(name: string, cronTime: string, taskId: string) {
    const job = CronJob.from({
      cronTime: cronTime,
      onTick: async () => {
        // update the task status
        await this.updateScheduler(taskId, {
          status: $Enums.TaskStatus.Finished,
        });
        this.logger.log('Job Executed');
      },
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} added at ${cronTime} `);
  }

  async upsertScheduler(
    taskId: string,
    updateObj: Prisma.schedulerUncheckedUpdateInput,
    createObj: Prisma.schedulerUncheckedCreateInput,
  ) {
    return await this.prisma.scheduler.upsert({
      where: {
        taskId,
      },
      create: createObj,
      update: updateObj,
    });
  }

  async updateScheduler(
    taskId: string,
    updateObj: Prisma.schedulerUncheckedUpdateInput,
  ) {
    return await this.prisma.scheduler.update({
      where: {
        taskId,
      },
      data: updateObj,
    });
  }

  convertUtcToCronExpression(dateString: string) {
    const date = new Date(dateString);
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${seconds || '*'} ${minutes || '*'} ${hours || '*'} ${dayOfMonth || '*'} ${month || '*'} ${dayOfWeek || '*'}`;
  }
}
