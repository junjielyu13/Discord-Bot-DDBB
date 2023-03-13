import { Injectable, Logger } from '@nestjs/common';
import { On, Once, InjectDiscordClient } from '@discord-nestjs/core';
import { Client, Message } from 'discord.js';

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
}
