import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class DBUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserCreateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prismaService.user.upsert({
      where: {
        userId: where.userId,
      },
      update: {},
      create: {
        userId: data.userId,
        userName: data.userName,
      },
    });
  }
}
