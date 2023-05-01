import { Injectable } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

import { HttpService } from '@nestjs/axios';

import { EmbedBuilder } from 'discord.js';

@Command({
  name: 'hello',
  description: 'hello to server',
})
@Injectable()
export class HelloCommand {
  constructor(private readonly http: HttpService) {}

  @Handler()
  async hello(interaction: CommandInteraction): Promise<any> {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Itaca')
      .setURL('https://github.com/junjielyu13/Discord-Bot-DDBB')
      .setAuthor({
        name: 'Your discord Bot',
        url: 'https://github.com/junjielyu13/Discord-Bot-DDBB',
      })
      .setDescription('Some description here')
      .setThumbnail('https://i.imgur.com/AfFp7pu.p')
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
      )
      .addFields({
        name: 'Inline field title',
        value: 'Some value here',
        inline: true,
      })
      .setImage('https://i.imgur.com/AfFp7pu.png')
      .setTimestamp()
      .setFooter({
        text: 'Some footer text here',
      });

    interaction.reply({ embeds: [exampleEmbed] });
  }
}
