import { Injectable, Logger } from '@nestjs/common';
import { On, Once, InjectDiscordClient } from '@discord-nestjs/core';
import { Client, Message, VoiceChannel, VoiceState } from 'discord.js';

import { EmbedBuilder } from 'discord.js';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Once('ready')
  onReady() {
    this.client.guilds.cache
      .get('867849049583255553')
      .members.fetch({ withPresences: true })
      .then((fetchedMembers) => {
        const totalOnline = fetchedMembers.filter(
          (member) => member.presence?.status != 'online',
        );
        // Now you have a collection with all online member objects in the totalOnline variable
        this.logger.log(
          `There are currently ${totalOnline.size} members online in this guild!`,
        );
      });

    this.logger.log(`Bot ${this.client.user.tag} was started!`);
  }

  @On('messageCreate')
  async onMessage(message: Message): Promise<void> {
    // const mentionedUser = message.mentions.users.first();
    if (!message.author.bot) {
      const userId = message.author.id;
      const username = message.author.username;
      const channelId = message.channelId;
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
