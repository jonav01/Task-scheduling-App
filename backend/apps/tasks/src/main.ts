import { NestFactory } from '@nestjs/core';
import { TasksModule } from './tasks.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TasksModule);
  const configService = app.get(ConfigService);
  const port = configService.get('TASKS_SERVER_PORT');
  await app.listen(port);
}
bootstrap();
