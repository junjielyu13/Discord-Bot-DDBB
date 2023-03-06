import { Controller, Post, Req, Get, Body, Query, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User as UserModel, Post as PostModel, Prisma } from '@prisma/client';

@Controller('db')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('user')
  async createDraft(): Promise<any> {
    return this.prismaService.user.create({
      data: {
        name: 'Alice',
        email: 'alice@prisma.io',
      },
    });
  }
}
