import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, UserChannelTime } from '@prisma/client';

@Injectable()
export class DBUserChannelTimeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUserChannelTime(
    data: Prisma.UserChannelTimeCreateInput,
  ): Promise<UserChannelTime> {
    return this.prismaService.userChannelTime.create({
      data,
    });
  }
}
