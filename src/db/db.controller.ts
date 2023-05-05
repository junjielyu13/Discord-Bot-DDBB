import { Controller } from '@nestjs/common';
import { DBUserService } from './service/db.user.service';
import { DBServerService } from './service/db.server.service';
import { DBChannelService } from './service/db.channel.service';
import { DBCommentService } from './service/db.comment.service';
import { DBCommandService } from './service/db.command.service';
import { DBTempsService } from './service/db.temps.service';
import { DBUserChannelTimeService } from './service/db.userChannelTime.service';
import { DBRegistreUserService } from './service/db.registreUser.service';
import { DBDiaryService } from './service/db.diary.service';
import { User, Server, RegistreUser, Channel } from '@prisma/client';

@Controller('db')
export class DBController {
  constructor(
    private readonly dbUserService: DBUserService,
    private readonly dbRegistreUserService: DBRegistreUserService,
    private readonly dbServerService: DBServerService,
    private readonly dbChannelService: DBChannelService,
    private readonly dbCommentService: DBCommentService,
    private readonly dbCommantService: DBCommandService,
    private readonly dbTempsService: DBTempsService,
    private readonly dbUserChannelTime: DBUserChannelTimeService,
    private readonly dbDiaryService: DBDiaryService,
  ) {}

  async upsertUser(data): Promise<User> {
    return this.dbUserService.upsertUser(data);
  }

  async upsertServer(data): Promise<Server> {
    return this.dbServerService.upsertServer(data);
  }

  async upsertRegistreUser(data): Promise<RegistreUser> {
    return this.dbRegistreUserService.upsertRegistreUser(data);
  }

  async upsertChannel(data): Promise<Channel> {
    return this.dbChannelService.upsertChannel(data);
  }

  async getUserChannelTimeByUsername(data): Promise<any> {
    return this.dbUserChannelTime.getUserChannelTimeByUsername(data);
  }
}
