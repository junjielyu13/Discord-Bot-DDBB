import { Module } from '@nestjs/common';
import { DBController } from './db.controller';
import { DBService } from './db.service';

@Module({
  imports: [],
  controllers: [DBController],
  providers: [DBService],
})
export class DBModule {}
