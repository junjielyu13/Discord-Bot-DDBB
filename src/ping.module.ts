import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { pingCommand } from './ping.gateway';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [pingCommand],
})
export class pingModule {}
