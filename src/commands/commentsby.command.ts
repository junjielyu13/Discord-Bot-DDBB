import { SlashCommandPipe } from '@discord-nestjs/common';
import {
  Command,
  EventParams,
  Handler,
  IA,
  InteractionEvent,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ClientEvents, Message } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { MessagePayload, InteractionReplyOptions } from 'discord.js';

import { HttpService } from '@nestjs/axios';

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
  constructor(
    private readonly http: HttpService,
    private readonly dbController: DBController,
  ) {}

  @Handler()
  async onCommentsBy(
    @IA(SlashCommandPipe) dto: byDto,
    @EventParams() args: ClientEvents['interactionCreate'],
    @InteractionEvent() interaction: CommandInteraction,
  ): Promise<any> {
    console.log(interaction);

    let resultat =
      'Time                          user name              channel Name           message       \n';

    if (dto.username == 'all' || dto.username === undefined) {
      const exampleEmbeds = []; // 用于存储多个页面的 embed 数组
      const pageSize = 25; // 每页显示的评论数量
      let currentPage = 0; // 当前页码

      await this.dbController
        .getAllComments({ serverId: args['guildId'] })
        .then((res) => {
          // 处理获取到的评论数据
          const comments = res; // 这里假设 res 是一个包含所有评论的数组

          // 分页处理评论数据
          for (let i = 0; i < comments.length; i += pageSize) {
            const pageComments = comments.slice(i, i + pageSize); // 获取当前页的评论

            // eslint-disable-next-line prefer-const
            let embed = new EmbedBuilder()
              .setColor(0x0099ff)
              .setTitle('Lista de Comments');

            //在 embed 中添加评论信息
            pageComments.forEach((comment) => {
              embed.addFields({
                name: comment.releaseAt,
                value: `${comment.user.userName} | ${comment.channel.channelName} | ${comment.message}`,
                inline: true,
              });
            });

            exampleEmbeds.push(embed); // 将当前页的 embed 添加到数组中
          }
        });

      // 延迟回复交互
      await interaction.deferReply();

      // ...其他代码...

      const sentMessage = (await interaction.editReply({
        embeds: [exampleEmbeds[currentPage]],
      })) as Message;

      await sentMessage.react('⏪'); // Previous page reaction
      await sentMessage.react('⏩'); // Next page reaction

      const filter = (reaction, user) =>
        ['⏪', '⏩'].includes(reaction.emoji.name) &&
        user.id === interaction.user.id;
      const collector = sentMessage.createReactionCollector({
        filter,
        time: 60000,
      });

      collector.on('collect', (reaction) => {
        reaction.users.remove(interaction.user.id);

        if (reaction.emoji.name === '⏪' && currentPage > 0) {
          currentPage--;
          sentMessage.edit({ embeds: [exampleEmbeds[currentPage]] });
        } else if (
          reaction.emoji.name === '⏩' &&
          currentPage < exampleEmbeds.length - 1
        ) {
          currentPage++;
          sentMessage.edit({ embeds: [exampleEmbeds[currentPage]] });
        }
      });

      collector.on('end', () => {
        sentMessage.reactions.removeAll().catch(console.error);
      });
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
