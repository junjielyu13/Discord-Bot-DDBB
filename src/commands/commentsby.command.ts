import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, EventParams, Handler, IA } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ClientEvents } from 'discord.js';

import { HttpService } from '@nestjs/axios';

import { byDto } from './dto/by.dto';

@Command({
  name: 'commentsby',
  description: 'get comments by username',
})
@Injectable()
export class CommentsBy {
  constructor(private readonly http: HttpService) {}

  @Handler()
  async onCommentsBy(
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
        .get('http://localhost:3000/prisma/getAllComment', {
          params: { serverId: args['guildId'] },
        })
        .toPromise()
        .then((res) => {
          res.data.forEach((element) => {
            resultat +=
              element.releaseAt +
              ' | ' +
              element.user.userName +
              ' | ' +
              element.channel.channelName +
              ' | ' +
              element.message +
              '\n';
          });
        });

      return `${resultat}`;
    } else {
      await this.http
        .get('http://localhost:3000/prisma/getCommentBy', {
          params: {
            userName: dto.username,
            serverId: args['guildId'],
          },
        })
        .toPromise()
        .then((res) => {
          res.data.forEach((element) => {
            resultat +=
              element.releaseAt +
              ' | ' +
              element.user.userName +
              ' | ' +
              element.channel.channelName +
              ' | ' +
              element.message +
              '\n';
          });
        });

      return `${resultat}`;
    }
  }
}
