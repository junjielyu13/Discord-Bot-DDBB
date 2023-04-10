import { Injectable, Logger } from '@nestjs/common';
import { On, Once, InjectDiscordClient } from '@discord-nestjs/core';
import { Client, Message, VoiceChannel, VoiceState } from 'discord.js';

import { EmbedBuilder } from 'discord.js';

import { HttpService } from '@nestjs/axios';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly http: HttpService,
  ) {}

  @Once('ready')
  async onReady() {
    const Guilds = this.client.guilds.cache.map(async (guild) => {
      let guildId = -1;

      this.http
        .post('http://localhost:3000/prisma/createServer', {
          guildId: guild.id,
          guildName: guild.name,
        })
        .toPromise()
        .then(async (res) => {
          guildId = res.data.id;
        });

      (await guild.members.fetch()).forEach((member) => {
        this.http
          .post('http://localhost:3000/prisma/createUser', {
            userId: member.id,
            userName: member.user.username,
          })
          .toPromise()
          .then(async (res) => {
            this.logger.log(res.data.id);

            this.http
              .post('http://localhost:3000/prisma/createRegistreUser', {
                userId: res.data.id,
                serverId: guildId,
              })
              .toPromise()
              .then();
          });
      });

      (await guild.channels.fetch()).forEach((channel) => {});
    });
  }

  @On('messageCreate')
  async onMessage(message: Message): Promise<void> {
    // const mentionedUser = message.mentions.users.first();

    if (!message.author.bot) {
      const userId = message.author.id;
      const username = message.author.username;
      const channelId = message.channelId;
      // const channelName = message.channel.name;
      const messageId = message.id;
      const messageContent = message.content;

      await message.reply(`
      User id: ${userId}
      User name: ${username} 
      Channel Id: ${channelId} 
      Message Id: ${messageId} 
      Message Content: ${messageContent} 
      `);
    }

    // TODO SAVE ON DDBB
  }

  @On('voiceStateUpdate')
  async onVoice(voiceState: VoiceState): Promise<void> {
    const userId = voiceState.member.id;
    const channelName = voiceState.channel.name;
    const channelId = voiceState.channel.id;

    this.logger.log(`update!! ${userId}  ${channelId} ${channelName}  `);
    // TODO SAVE ON DDBB
  }
}
