import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiscordModule } from '@discord-nestjs/core';
import { PingCommand } from '../commands/ping.command';
import { HelloCommand } from '../commands/hello.command';
import { HelpCommand } from '../commands/help.command';
import { CommentByCommand } from '../commands/commentsby.command';

@Module({
  imports: [
    DiscordModule.forFeature(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [PingCommand, HelloCommand, HelpCommand, CommentByCommand],
})
export class CommandModule {}
