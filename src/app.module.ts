import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';

import * as dotenv from 'dotenv';

const TOKEN = process.env.BOT_TOKEN;
dotenv.config();

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
        discordClientOptions: {
          intents: [GatewayIntentBits.Guilds],
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
