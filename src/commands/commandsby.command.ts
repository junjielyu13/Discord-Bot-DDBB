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
  name: 'commandsby',
  description: 'get commands by username',
  defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
  dmPermission: false,
})
@Injectable()
export class CommandsBy {
  constructor(private readonly dbController: DBController) {}

  @Handler()
  async onCommandsBy(
    @IA(SlashCommandPipe) dto: byDto,
    @EventParams() args: ClientEvents['interactionCreate'],
    @InteractionEvent() interaction,
  ): Promise<any> {
    let resultat = '';
    if (dto.username.toLowerCase() == 'all' || dto.username === undefined) {
      resultat += `                             All commands List, page: ${dto.page}                              \n\n`;
      await this.dbController
        .getAllCommandsByPage({
          serverId: args['guildId'],
          page: dto.page * 10 - 10,
        })
        .then((commands) => {
          commands.forEach((command) => {
            resultat += `${this.convertTime(command.releaseAt).padStart(
              20,
              ' ',
            )} | ${command.user.userName.padStart(
              30,
              ' ',
            )} | ${command.channel.channelName.padStart(15, ' ')}  | ${
              command.commandId
            } \n\n`;
          });
        });

      interaction.reply(resultat);
    } else {
      resultat += `                         All commands List for ${dto.username}, page: ${dto.page}                        \n\n`;
      await this.dbController
        .getAllCommandsByUsename({
          serverId: args['guildId'],
          userName: dto.username,
          page: dto.page * 10 - 10,
        })
        .then((commands) => {
          commands.forEach((command) => {
            resultat += `${this.convertTime(command.releaseAt).padStart(
              20,
              ' ',
            )}  | ${command.channel.channelName.padStart(15, ' ')}  |  ${
              command.commandId
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
