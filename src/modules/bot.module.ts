import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from '../gateways/bot.gateway';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { DBModule } from '../db/db.module';
import { PingCommand } from '../commands/ping.command';
import { HelloCommand } from '../commands/hello.command';
import { HelpCommand } from '../commands/help.command';
import { CommentsBy } from '../commands/commentsby.command';
import { CommandsBy } from '../commands/commandsby.command';
import { ChannelTimeBy } from '../commands/channeltimeby.command';
import { Diaryby } from '../commands/diaryby.command';
import { RankComments } from '../commands/rankcomments.command';
import { RankCommentsDiary } from '../commands/rankcommentsdiary.command';
import { RankCommands } from '../commands/rankcommands.command';
import { RankChannelTime } from '../commands/rankchanneltime.command';
import { RankCommandsDiary } from '../commands/rankcommandsdiary.command';

@Module({
  imports: [
    DiscordModule.forFeature(),
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    DBModule,
  ],
  providers: [
    BotGateway,
    PingCommand,
    HelloCommand,
    HelpCommand,
    CommentsBy,
    CommandsBy,
    ChannelTimeBy,
    Diaryby,
    RankComments,
    RankCommentsDiary,
    RankCommands,
    RankCommandsDiary,
    RankChannelTime,
  ],
  exports: [],
})
export class BotModule {}
