import { Injectable } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

import { PermissionFlagsBits } from 'discord.js';

import { HttpService } from '@nestjs/axios';

import { EmbedBuilder } from 'discord.js';

@Command({
  name: 'help',
  description: 'help to server',
  defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
  dmPermission: false,
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
      .setThumbnail(
        'https://raw.githubusercontent.com/junjielyu13/Discord-Bot-DDBB/main/public/img/icono.jpg',
      )
      .addFields({ name: '/help', value: 'help page' })
      .addFields({ name: '/ping', value: 'test page' })
      .addFields({ name: '/hello', value: 'hello page' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .addFields({ name: 'Regular field title', value: 'Some value here' })
      .setTimestamp();

    interaction.reply({ embeds: [exampleEmbed] });
  }
}
