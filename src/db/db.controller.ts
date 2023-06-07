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
import { User, Server, RegistreUser, Channel, Comment } from '@prisma/client';

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

  async getUser(data): Promise<User> {
    return this.dbUserService.getUser(data);
  }

  async upsertServer(data): Promise<any> {
    return this.dbServerService.upsertServer(data);
  }

  async upsertRegistreUser(data): Promise<RegistreUser> {
    return this.dbRegistreUserService.upsertRegistreUser(data);
  }

  async upsertChannel(data): Promise<any> {
    return this.dbChannelService.upsertChannel(data);
  }

  async getChannelById(data): Promise<any> {
    return this.dbChannelService.getChannelById(data);
  }

  async createComment(data): Promise<Comment> {
    return this.dbCommentService.createComment(data);
  }

  async createCommand(data): Promise<any> {
    return this.dbCommantService.createCommand(data);
  }

  async createTemps(data): Promise<any> {
    return this.dbTempsService.createTemps(data);
  }

  async getTempsByUserId(data): Promise<any> {
    return this.dbTempsService.getTempsByUserId(data);
  }

  async createUserChannelTime(data): Promise<any> {
    return this.dbUserChannelTime.createUserChannelTime(data);
  }

  async getUserChannelTimeByUsername(data): Promise<any> {
    return this.dbUserChannelTime.getUserChannelTimeByUsername(data);
  }

  async deleteAllTempsByUserId(data): Promise<any> {
    return this.dbTempsService.deleteAllTempsByUserId(data);
  }

  async deleteAllTimeByUserIdUnlessLastOne(data): Promise<any> {
    let tempIdsToDelete;
    this.dbTempsService.getAllTempsByUserId(data).then((res) => {
      tempIdsToDelete = res.slice(1).map((temp) => temp.id);
    });

    return await this.dbTempsService.deleteAllTempsByUserIdWithNotIn(
      data,
      tempIdsToDelete,
    );
  }
}
