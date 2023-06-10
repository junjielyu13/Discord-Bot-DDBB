import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DBCommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(data: any): Promise<any> {
    return this.prismaService.comment.create({
      data: {
        commentId: data.commentId,
        user: {
          connect: {
            id: data.user.id,
          },
        },
        message: data.message,
        channel: {
          connect: {
            id: data.channel.id,
          },
        },
      },
    });
  }

  async getAllComments(where: any): Promise<any> {
    return this.prismaService.comment.findMany({
      where: {
        channel: {
          server: {
            ServerId: where.serverId,
          },
        },
      },
      select: {
        message: true,
        releaseAt: true,
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
          releaseAt: 'desc',
        },
      ],
      skip: where.page,
      take: 10,
    });
  }

  async getAllCommentsByUername(where: any): Promise<any> {
    return this.prismaService.comment.findMany({
      where: {
        channel: {
          server: {
            ServerId: where.serverId,
          },
        },
        user: {
          userName: where.userName,
        },
      },
      select: {
        message: true,
        releaseAt: true,
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
          releaseAt: 'desc',
        },
      ],
      skip: where.page,
      take: 10,
    });
  }
}
