import { Injectable } from '@nestjs/common';
import { Command, Handler } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';

import { HttpService } from '@nestjs/axios';

import { EmbedBuilder } from 'discord.js';

@Command({
  name: 'hello',
  description: 'hello to server',
  defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
  dmPermission: false,
})
@Injectable()
export class HelloCommand {
  @Handler()
  async hello(interaction: CommandInteraction): Promise<any> {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Itaca')
      .setURL('https://github.com/junjielyu13/Discord-Bot-DDBB')
      .setAuthor({
        name: 'Your discord Channel Bot',
        url: 'https://github.com/junjielyu13/Discord-Bot-DDBB',
      })
      .setDescription(
        "Hi, I'm your discord bot ítaca! I am a script Bot specially designed and programmed to provide various information gathering and daily assistance services for your channel. I have been designed with a high degree of automation and artificial intelligence to multi-task and make your channel more convenient and comfortable❤️😘 \n\n try /help to see what other functions I have!",
      )
      .setThumbnail(
        'https://raw.githubusercontent.com/junjielyu13/Discord-Bot-DDBB/main/public/img/icono.jpg',
      )
      .setTimestamp();

    interaction.reply({ embeds: [exampleEmbed] });
  }
}
