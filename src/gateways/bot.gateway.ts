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
  onReady() {
    const Guilds = this.client.guilds.cache.map((guild) => {
      const guildId = guild.id;
      const guildName = guild.name;
      this.http
        .post('http://localhost:3000/prisma/server', {
          guildId: guildId,
          guildName: guildName,
        })
        .toPromise()
        .then();
    });

    // this.client.guilds.cache
    //   .get('867849049583255553')
    //   .members.fetch({ withPresences: true })
    //   .then((fetchedMembers) => {
    //     const totalOnline = fetchedMembers.filter(
    //       (member) => member.presence?.status != 'online',
    //     );
    //     // Now you have a collection with all online member objects in the totalOnline variable
    //     this.logger.log(
    //       `There are currently ${totalOnline.size} members online in this guild!`,
    //     );
    //   });
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
