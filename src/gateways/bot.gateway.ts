import { Injectable, Logger } from '@nestjs/common';
import { On, Once, InjectDiscordClient } from '@discord-nestjs/core';
import {
  Client,
  Message,
  VoiceChannel,
  VoiceState,
  Interaction,
} from 'discord.js';

import { EmbedBuilder } from 'discord.js';

import { Cron } from '@nestjs/schedule';

import { HttpService } from '@nestjs/axios';

import { DBController } from '../db/db.controller';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly http: HttpService,
    private readonly dbController: DBController,
  ) {}

  @Once('ready')
  async onReady() {
    this.client.guilds.cache.map(async (guild) => {
      this.dbController
        .upsertServer({
          where: { ServerId: guild.id },
          data: { ServerId: guild.id, ServerName: guild.name },
        })
        .then(async (server) => {
          (await guild.members.fetch()).forEach((member) => {
            this.dbController
              .upsertUser({
                where: { userId: member.id },
                data: { userId: member.id, userName: member.user.username },
              })
              .then(async (user) => {
                this.dbController.upsertRegistreUser({
                  where: {
                    registreUserServerId: {
                      userId: user.id,
                      serverId: server.id,
                    },
                  },
                  data: {
                    userId: user.id,
                    serverId: server.id,
                  },
                });
              });
          });

          (await guild.channels.fetch()).forEach((channel) => {
            this.dbController.upsertChannel({
              where: {
                channelId: channel.id,
              },
              data: {
                server: server,
                channelId: channel.id,
                channelName: channel.name,
                channelType: channel.type,
              },
            });
          });
        });
    });
  }

  @On('messageCreate')
  async onMessage(message: Message): Promise<void> {
    if (!message.author.bot) {
      this.dbController
        .getUser({ where: { userId: message.author.id } })
        .then((user) => {
          this.dbController
            .getChannelById({ where: { channelId: message.channelId } })
            .then((channel) => {
              this.dbController.createComment({
                commentId: message.id,
                user: user,
                message: message.content,
                channel: channel,
              });
            });
        });
    }
  }

  @On('interactionCreate')
  async onInteraction(action: Interaction): Promise<void> {
    if (action) {
      this.dbController
        .getUser({ where: { userId: action.user.id } })
        .then((user) => {
          this.dbController
            .getChannelById({ where: { channelId: action.channel.id } })
            .then((channel) => {
              this.dbController.createCommand({
                commandId: action['commandName'],
                user: user,
                channel: channel,
              });
            });
        });
    }
  }

  // @On('voiceStateUpdate')
  // async onVoice(oldState: VoiceState, newState: VoiceState): Promise<void> {
  //   const member = newState.member;
  //   if (!member.user.bot) {
  //     const newChannelID = newState.channelId;
  //     const oldChannelID = oldState.channelId;

  //     if (newChannelID && !oldChannelID) {
  //       this.dbController.createTemps({
  //         userId: member.id,
  //         channelId: newChannelID,
  //         statu: false,
  //       });
  //     } else if (!newChannelID && oldChannelID) {
  //       await this.dbController
  //         .createTemps({
  //           userId: member.id,
  //           channelId: oldChannelID,
  //           statu: false,
  //         })
  //         .then(async () => {
  //           await this.dbController
  //             .getTempsByUserId({ where: { userId: member.id } })
  //             .then(async (res) => {
  //               console.log(res);

  //               let totalSeconds = 0;
  //               for (let i = 0; i < res.length - 1; i++) {
  //                 const startTime = new Date(res[i].createdAt).getTime();
  //                 const endTime = new Date(res[i + 1].createdAt).getTime();
  //                 totalSeconds += (endTime - startTime) / 1000;
  //               }

  //               console.log(totalSeconds);

  //               await this.dbController
  //                 .getUser({ where: { userId: member.id } })
  //                 .then(async (user) => {
  //                   await this.dbController
  //                     .getChannelById({
  //                       where: { channelId: oldChannelID },
  //                     })
  //                     .then(async (channel) => {
  //                       await this.dbController
  //                         .createUserChannelTime({
  //                           user: user,
  //                           channel: channel,
  //                           time: String(totalSeconds),
  //                         })
  //                         .then(async () => {
  //                           await this.dbController.deleteAllTempsByUserId({
  //                             where: { userId: member.id },
  //                           });
  //                         });
  //                     });
  //                 });
  //             });
  //         });
  //     } else {
  //       await this.dbController
  //         .createTemps({
  //           userId: member.id,
  //           channelId: newChannelID,
  //           statu: false,
  //         })
  //         .then(async () => {
  //           await this.dbController
  //             .getTempsByUserId({ where: { userId: member.id } })
  //             .then(async (res) => {
  //               console.log(res);

  //               let totalSeconds = 0;
  //               for (let i = 0; i < res.length - 1; i++) {
  //                 const startTime = new Date(res[i].createdAt).getTime();
  //                 const endTime = new Date(res[i + 1].createdAt).getTime();
  //                 totalSeconds += (endTime - startTime) / 1000;
  //               }

  //               console.log(totalSeconds);

  //               await this.dbController
  //                 .getUser({ where: { userId: member.id } })
  //                 .then(async (user) => {
  //                   await this.dbController
  //                     .getChannelById({
  //                       where: { channelId: newChannelID },
  //                     })
  //                     .then(async (channel) => {
  //                       await this.dbController
  //                         .createUserChannelTime({
  //                           user: user,
  //                           channel: channel,
  //                           time: String(totalSeconds),
  //                         })
  //                         .then(async () => {
  //                           // await this.dbController.deleteAllTimeByUserIdUnlessLastOne(
  //                           //   {
  //                           //     where: { userId: member.id },
  //                           //   },
  //                           // );
  //                           await this.http
  //                             .get(
  //                               'http://localhost:3000/prisma/DeleteTimeChannelByUserId',
  //                               {
  //                                 params: { userId: member.id },
  //                               },
  //                             )
  //                             .toPromise()
  //                             .then();
  //                         });
  //                     });
  //                 });
  //             });
  //         });
  //     }
  //   }
  // }

  @On('voiceStateUpdate')
  async onVoice(oldState: VoiceState, newState: VoiceState): Promise<void> {
    const member = newState.member;
    if (!member.user.bot) {
      const newChannelID = newState.channelId;
      const oldChannelID = oldState.channelId;

      if (newChannelID && !oldChannelID) {
        await this.http
          .post('http://localhost:3000/prisma/joinTempOnChannel', {
            userId: member.id,
            channelId: newChannelID,
            statu: false,
          })
          .toPromise()
          .then();
      } else if (!newChannelID && oldChannelID) {
        await this.http
          .post('http://localhost:3000/prisma/joinTempOnChannel', {
            userId: member.id,
            channelId: oldChannelID,
            statu: false,
          })
          .toPromise()
          .then(async () => {
            await this.http
              .get('http://localhost:3000/prisma/GetTimeChannelByUserId', {
                params: { userId: member.id },
              })
              .toPromise()
              .then(async (res) => {
                let totalSeconds = 0;
                for (let i = 0; i < res.data.length - 1; i++) {
                  const startTime = new Date(res.data[i].createdAt).getTime();
                  const endTime = new Date(res.data[i + 1].createdAt).getTime();
                  totalSeconds += (endTime - startTime) / 1000;
                }
                this.logger.log(`${totalSeconds}`);

                let userId = -1;
                let channelId = -1;
                await this.http
                  .get('http://localhost:3000/prisma/getUser', {
                    params: { userId: member.id },
                  })
                  .toPromise()
                  .then((user) => {
                    userId = user.data.id;
                  });

                await this.http
                  .get('http://localhost:3000/prisma/getChannel', {
                    params: { channelId: oldChannelID },
                  })
                  .toPromise()
                  .then((channel) => {
                    channelId = channel.data.id;
                  });

                await this.http
                  .post('http://localhost:3000/prisma/writeUserChannelTime', {
                    userId: userId,
                    channelId: channelId,
                    time: String(totalSeconds),
                  })
                  .toPromise()
                  .then(async () => {
                    if (totalSeconds) {
                      await this.http
                        .get(
                          'http://localhost:3000/prisma/DeleteAllTimeChannelByUserId',
                          {
                            params: { userId: member.id },
                          },
                        )
                        .toPromise()
                        .then();
                    }
                  });
              });
          });
      } else {
        await this.http
          .post('http://localhost:3000/prisma/joinTempOnChannel', {
            userId: member.id,
            channelId: newChannelID,
            statu: false,
          })
          .toPromise()
          .then(async () => {
            await this.http
              .get('http://localhost:3000/prisma/GetTimeChannelByUserId', {
                params: { userId: member.id },
              })
              .toPromise()
              .then(async (res) => {
                let totalSeconds = 0;
                for (let i = 0; i < res.data.length - 1; i++) {
                  const startTime = new Date(res.data[i].createdAt).getTime();
                  const endTime = new Date(res.data[i + 1].createdAt).getTime();
                  totalSeconds += (endTime - startTime) / 1000;
                }
                this.logger.log(`${totalSeconds}`);

                let userId = -1;
                let channelId = -1;
                await this.http
                  .get('http://localhost:3000/prisma/getUser', {
                    params: { userId: member.id },
                  })
                  .toPromise()
                  .then((user) => {
                    userId = user.data.id;
                  });

                await this.http
                  .get('http://localhost:3000/prisma/getChannel', {
                    params: { channelId: newChannelID },
                  })
                  .toPromise()
                  .then((channel) => {
                    channelId = channel.data.id;
                  });

                await this.http
                  .post('http://localhost:3000/prisma/writeUserChannelTime', {
                    userId: userId,
                    channelId: channelId,
                    time: String(totalSeconds),
                  })
                  .toPromise()
                  .then(async () => {
                    if (totalSeconds) {
                      await this.http
                        .get(
                          'http://localhost:3000/prisma/DeleteTimeChannelByUserId',
                          {
                            params: { userId: member.id },
                          },
                        )
                        .toPromise()
                        .then();
                    }
                  });
              });
          });
      }
    }
  }

  // @Cron('0 0 10 * * *')
  // async handleCron() {
  //   this.logger.log('Called when the current second is 45');
  // }

  // @Cron('10 * * * * *')
  // async handleCron() {
  //   this.logger.log('Called when the current second is 10');

  //   const date = new Date().toJSON().slice(0, 19).replace('T', ':');

  //   this.logger.log(`${date}`);
  // }
}
