import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { PingCommand } from '../commands/ping.command';
import { DBModule } from '../db/db.module';
import { DBService } from '../db/db.service';
import { DBController } from '../db/db.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DiscordModule.forFeature(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [PingCommand],
})
export class PingModule {}
