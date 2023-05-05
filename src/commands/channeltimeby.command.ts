import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, EventParams, Handler, IA } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ClientEvents } from 'discord.js';

import { HttpService } from '@nestjs/axios';

import { byDto } from './dto/by.dto';
import { DBController } from '../db/db.controller';

@Command({
  name: 'channeltimeby',
  description: 'get comments by username',
})
@Injectable()
export class ChannelTimeBy {
  constructor(
    private readonly http: HttpService,
    private readonly dbController: DBController,
  ) {}

  @Handler()
  async onCommandsBy(
    @IA(SlashCommandPipe) dto: byDto,
    @EventParams() args: ClientEvents['interactionCreate'],
  ): Promise<any> {
    // console.log('DTO', dto);
    // console.log('Event args', args);
    // console.log('Event args', args['guildId']);
    let resultat =
      'Time                          user name              channel Name           message       \n';

    if (dto.username == 'all' || dto.username === undefined) {
      await this.http
        .get('http://localhost:3000/prisma/getAllUserChannelTime', {
          params: { serverId: args['guildId'] },
        })
        .toPromise()
        .then((res) => {
          res.data.forEach((element) => {
            resultat +=
              element.createdAt +
              ' | ' +
              element.user.userName +
              ' | ' +
              element.channel.channelName +
              ' | ' +
              element.time +
              's\n';
          });
        });
      return `${resultat}`;
    } else {
      await this.dbController
        .getUserChannelTimeByUsername({
          userName: dto.username,
          serverId: args['guildId'],
        })
        .then((res) => {
          res.forEach((element) => {
            console.log(typeof element.time);
            console.log(typeof element.createdAt);
            console.log(typeof element.channel.channelName);

            resultat +=
              element.createdAt +
              ' | ' +
              element.channel.channelName +
              ' | ' +
              element.time +
              's\n';
          });
        });
      return `${resultat}`;
    }
  }
}
