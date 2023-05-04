import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from '../gateways/bot.gateway';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { DBModule } from '../db/db.module';
import { CommandModule } from './command.module';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { PlayCommand } from '../commands/commentsby.command';

@InjectDynamicProviders('**/*.command.ts')
@Module({
  imports: [
    DiscordModule.forFeature(),
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    DBModule,
    CommandModule,
  ],
  providers: [BotGateway],
  exports: [],
})
export class BotModule {}
