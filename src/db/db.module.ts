import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DBController } from './db.controller';
import { DBUserService } from './service/db.user.service';
import { DBServerService } from './service/db.server.service';
import { DBChannelService } from './service/db.channel.service';
import { DBRegistreUser } from './service/db.registreUser.service';
import { DBCommentService } from './service/db.comment.service';
import { DBCommandService } from './service/db.command.service';
import { DBTempsService } from './service/db.temps.service';
import { DBUserChannelTimeService } from './service/db.userChannelTime.service';

@Module({
  imports: [PrismaModule],
  controllers: [DBController],
  providers: [
    DBController,
    DBUserService,
    DBServerService,
    DBChannelService,
    DBRegistreUser,
    DBCommentService,
    DBCommandService,
    DBTempsService,
    DBUserChannelTimeService,
  ],
  exports: [DBController],
})
export class DBModule {}
