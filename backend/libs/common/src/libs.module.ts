import { Module } from '@nestjs/common';
import { PrismaService } from './dbConnection.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class LibsModule {}
