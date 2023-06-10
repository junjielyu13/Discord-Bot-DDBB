import { SlashCommandPipe } from '@discord-nestjs/common';
import {
  Command,
  EventParams,
  Handler,
  IA,
  InteractionEvent,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ClientEvents } from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';

import { byDto } from './dto/by.dto';

import { DBController } from '../db/db.controller';

@Command({
  name: 'commentsby',
  description: 'get comments by username (option: userName, default: all)',
  defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
  dmPermission: false,
})
@Injectable()
export class CommentsBy {
  constructor(private readonly dbController: DBController) {}

  @Handler()
  async onCommentsBy(
    @IA(SlashCommandPipe) dto: byDto,
    @EventParams() args: ClientEvents['interactionCreate'],
    @InteractionEvent() interaction,
  ): Promise<any> {
    console.log(args['guildId']);

    let resultat = '';
    if (dto.username.toLowerCase() == 'all' || dto.username === undefined) {
      resultat += `                             All comments List, page: ${dto.page}                              \n`;
      await this.dbController
        .getAllComments({ serverId: args['guildId'], page: dto.page * 10 - 10 })
        .then((comments) => {
          comments.forEach((comment) => {
            resultat += `${this.convertTime(comment.releaseAt).padStart(
              20,
              ' ',
            )} | ${comment.user.userName.padStart(
              30,
              ' ',
            )} | ${comment.channel.channelName.padStart(15, ' ')}  | ${
              comment.message
            } \n\n`;
          });
        });

      interaction.reply(resultat);
    } else {
      resultat += `                         All comments List for ${dto.username}, page: ${dto.page}                        \n`;
      await this.dbController
        .getAllCommentsByUsename({
          serverId: args['guildId'],
          userName: dto.username,
          page: dto.page * 10 - 10,
        })
        .then((comments) => {
          comments.forEach((comment) => {
            console.log(comment);

            resultat += `${this.convertTime(comment.releaseAt).padStart(
              20,
              ' ',
            )}  | ${comment.channel.channelName.padStart(15, ' ')}  |  ${
              comment.message
            } \n\n`;
          });
        });

      interaction.reply(resultat);
    }
  }

  private convertTime(data) {
    const inputDate = new Date(data);
    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = String(inputDate.getFullYear());
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const seconds = String(inputDate.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}
