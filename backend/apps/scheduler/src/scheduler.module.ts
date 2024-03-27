import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { validateEnv } from '../validation';
import { SchedulerController } from './scheduler/scheduler.controller';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.production'],
      validationSchema: Joi.object(validateEnv),
    }),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
