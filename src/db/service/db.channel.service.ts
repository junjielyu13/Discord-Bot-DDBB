import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class DBChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertChannel(params: { where: any; data: any }): Promise<any> {
    const { where, data } = params;
    return this.prismaService.channel.upsert({
      where: {
        channelId: where.channelId,
      },
      update: {
        serverId: data.server.id,
        channelName: data.channelName,
        channelId: data.channelId,
        channelType: data.channelType,
      },
      create: {
        server: {
          create: {
            id: data.server.id,
            ServerId: data.server.ServerId,
            ServerName: data.server.ServerId,
          },
        },
        channelName: data.channelName,
        channelId: data.channelId,
        channelType: data.channelType,
      },
    });
  }

  async getChannelById(params: { where: any }): Promise<any> {
    const { where } = params;
    return this.prismaService.channel.findUnique({
      where: {
        channelId: where.channelId,
      },
    });
  }
}
