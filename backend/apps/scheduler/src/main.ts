import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SchedulerModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [new ConfigService().get<string>('KAFKA_BROKER_URL')],
        },
        consumer: {
          groupId: 'scheduler-microservice',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
