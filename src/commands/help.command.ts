import { Injectable } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

import { HttpService } from '@nestjs/axios';

import { EmbedBuilder } from 'discord.js';

@Command({
  name: 'help',
  description: 'help to server',
})
@Injectable()
export class HelpCommand {
  constructor(private readonly http: HttpService) {}

  @Handler()
  async help(interaction: CommandInteraction): Promise<any> {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Help')
      .setURL('https://github.com/junjielyu13/Discord-Bot-DDBB')
      .setAuthor({
        name: 'Itaca',
        url: 'https://github.com/junjielyu13/Discord-Bot-DDBB',
      })
      .setDescription('Some description here')
      .setThumbnail('https://i.imgur.com/AfFp7pu.p')
      .addFields({ name: '/help', value: 'Some value here' })
      .addFields({ name: '/ping', value: 'Some value here' })
      .addFields({ name: '/hello', value: 'Some value here' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .setTimestamp();

    interaction.reply({ embeds: [exampleEmbed] });
  }
}
