import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
interface ITasksCreateObject {
  id?: string;
  v: number;
  description: string;
  name: string;
  parameters: string;
  schedule: string;
  status: string;
  type: string;
}
@Resolver()
export class TasksResolver {
  constructor(private readonly taskService: TasksService) {}
  @Mutation('createTasks')
  async createTasks(
    @Args('createTasksInput') createTasksInput: ITasksCreateObject,
  ) {
    return await this.taskService.createTasks(createTasksInput);
  }
}
