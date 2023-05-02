import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Comment } from '@prisma/client';

@Injectable()
export class DBCommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(data: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prismaService.comment.create({
      data,
    });
  }
}
