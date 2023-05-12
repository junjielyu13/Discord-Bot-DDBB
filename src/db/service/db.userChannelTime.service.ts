import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, UserChannelTime } from '@prisma/client';

@Injectable()
export class DBUserChannelTimeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUserChannelTime(data: any): Promise<any> {
    return this.prismaService.userChannelTime.create({
      data: {
        time: data.time,
        user: {
          connect: {
            id: data.user.id,
          },
        },
        channel: {
          connect: {
            id: data.channel.id,
          },
        },
      },
    });
  }

  async getUserChannelTimeByUsername(where: any): Promise<any> {
    return this.prismaService.userChannelTime.findMany({
      where: {
        user: {
          userName: where.userName,
        },
        channel: {
          server: {
            ServerId: where.serverId,
          },
        },
      },
      select: {
        time: true,
        createdAt: true,
        channel: {
          select: {
            channelName: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      take: 25,
    });
  }
}
