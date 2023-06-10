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

  async getAllUserChannelTime(where: any): Promise<any> {
    return this.prismaService.userChannelTime.findMany({
      where: {
        channel: {
          server: {
            ServerId: where.serverId,
          },
        },
      },
      select: {
        time: true,
        createdAt: true,
        user: {
          select: {
            userName: true,
          },
        },
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
      skip: where.page,
      take: 10,
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
      skip: where.page,
      take: 10,
    });
  }

  async getAllUserChannelTimeByDate(where: any): Promise<any> {
    return this.prismaService.userChannelTime.findMany({
      where: {
        createdAt: {
          gte: new Date(where.today),
          lt: new Date(where.nextDay),
        },
      },
      select: {
        time: true,
        createdAt: true,
        user: {
          select: {
            userName: true,
          },
        },
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
      skip: where.page,
      take: 10,
    });
  }
}
