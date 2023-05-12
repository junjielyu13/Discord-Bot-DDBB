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
}
