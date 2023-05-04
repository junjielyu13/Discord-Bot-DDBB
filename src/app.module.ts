import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';

import { DiscordModule } from '@discord-nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayIntentBits, IntentsBitField } from 'discord.js';
import { BotModule } from './modules/bot.module';
import { PrismaModule } from './prisma/prisma.module';
import { DBModule } from './db/db.module';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('BOT_TOKEN'),
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildIntegrations,
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.DirectMessages,
          ],
        },
        registerCommandOptions: [
          {
            forGuild: configService.get('GUILD_ID_WITH_COMMANDS'),
            removeCommandsBefore: true,
          },
        ],
        failOnLogin: true,
      }),
      inject: [ConfigService],
    }),
    BotModule,
    PrismaModule,
    DBModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
