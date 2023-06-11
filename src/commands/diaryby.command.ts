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

import { diarybyDto } from './dto/diaryby.dto';
import { DBController } from '../db/db.controller';

@Command({
  name: 'diaryby',
  description: 'get channel time by username',
  defaultMemberPermissions: [PermissionFlagsBits.UseApplicationCommands],
  dmPermission: false,
})
@Injectable()
export class Diaryby {
  constructor(private readonly dbController: DBController) {}

  @Handler()
  async onDiaryby(
    @IA(SlashCommandPipe) dto: diarybyDto,
    @EventParams() args: ClientEvents['interactionCreate'],
    @InteractionEvent() interaction,
  ): Promise<any> {
    let resultat = `                             All Channel Time List for ${dto.date}, page: ${dto.page}                              \n\n`;

    if (typeof dto.page !== 'number') {
      dto.page = 1;
    }

    if (
      dto.date === 'hoy' ||
      dto.date === 'today' ||
      dto.date == null ||
      dto.date === undefined
    ) {
      await this.dbController
        .getAllUserChannelTimeByDate({
          today: this.getCurrentDate(),
          nextDay: this.getNextDayDate(this.getCurrentDate()),
          page: dto.page * 10 - 10,
        })
        .then((channelTimes) => {
          channelTimes.forEach((channelTime) => {
            resultat += `${this.convertTime(channelTime.createdAt).padStart(
              20,
              ' ',
            )} | ${channelTime.user.userName.padStart(
              30,
              ' ',
            )} | ${channelTime.channel.channelName.padStart(
              15,
              ' ',
            )}  | ${Math.abs(parseFloat(channelTime.time)).toFixed(2)}s \n\n`;
          });
        });
    } else {
      await this.dbController
        .getAllUserChannelTimeByDate({
          today: dto.date,
          nextDay: this.getNextDayDate(dto.date),
          page: dto.page * 10 - 10,
        })
        .then((channelTimes) => {
          channelTimes.forEach((channelTime) => {
            resultat += `${this.convertTime(channelTime.createdAt).padStart(
              20,
              ' ',
            )} | ${channelTime.user.userName.padStart(
              30,
              ' ',
            )} | ${channelTime.channel.channelName.padStart(
              15,
              ' ',
            )}  | ${Math.abs(parseFloat(channelTime.time)).toFixed(2)}s \n\n`;
          });
        });
    }

    interaction.reply(resultat);
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

  private getNextDayDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  private getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
