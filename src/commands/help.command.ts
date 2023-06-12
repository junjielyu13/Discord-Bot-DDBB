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
      .addFields({ name: '/hello', value: 'hello~' })
      .addFields({ name: '/help', value: 'help page' })
      .addFields({ name: '/ping', value: 'testing connection' })
      .addFields({ name: '/commentsby', value: 'get comments by username' })
      .addFields({ name: '/commandsby', value: 'get commands by username' })
      .addFields({
        name: '/channeltimeby',
        value: 'get channel time by username',
      })
      .addFields({
        name: '/diaryby',
        value: 'get channel time diary by username',
      })
      .addFields({
        name: '/rankcomments',
        value: 'Top 10 most comments by user',
      })
      .addFields({
        name: '/rankcommentsdiary',
        value: 'Top 10 most comments by diary',
      })
      .addFields({
        name: '/rankcommands',
        value: 'Top 10 most commands by user',
      })
      .addFields({
        name: '/rankcommandsdiary',
        value: 'Top 10 most commands by diary',
      })
      .addFields({
        name: '/rankchanneltime',
        value: 'Top 10 most channel time by user',
      })
      .addFields({
        name: '/rankchanneltimediary',
        value: 'Top 10 most channel time by diary',
      })
      .setTimestamp();

    interaction.reply({ embeds: [exampleEmbed] });
  }
}
