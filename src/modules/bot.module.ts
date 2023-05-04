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

@Module({
  imports: [
    DiscordModule.forFeature(),
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    DBModule,
  ],
  providers: [BotGateway, PingCommand, HelloCommand, HelpCommand, CommentsBy],
  exports: [],
})
export class BotModule {}
