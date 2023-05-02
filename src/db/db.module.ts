import { Module } from '@nestjs/common';
import { DBController } from './db.controller';
import { DBService } from './db.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DBController],
  providers: [DBService],
  exports: [DBService],
})
export class DBModule {}
