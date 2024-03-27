import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { validateEnv } from './validation';
import { TasksService } from './tasks/tasks.service';
import { LibsModule } from 'libs/common/src/libs.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksResolver } from './tasks/tasks.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.production'],
      validationSchema: Joi.object(validateEnv),
    }),
    ClientsModule.registerAsync([
      {
        name: 'TASKS_SERVICE',
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'tasks',
                brokers: [configService.get<string>('KAFKA_BROKER_URL')],
              },
              consumer: {
                groupId: 'scheduler-microservice',
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    LibsModule,
  ],
  controllers: [],
  providers: [TasksService, TasksResolver],
})
export class TasksModule {}
