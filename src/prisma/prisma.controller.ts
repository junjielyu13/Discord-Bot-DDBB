import { Controller, Post, Req, Get, Body, Query, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service';
// import { User as UserModel, Post as PostModel, Prisma } from '@prisma/client';

@Controller('/prisma')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('user')
  async createDraft(): Promise<any> {
    return this.prismaService.user.create({
      data: {
        user_id: 1632,
        user_name: '100000 00000000000000',
        role: '1000000000000000000000',
        status: '10000000000000000000',
      },
    });
  }
}
