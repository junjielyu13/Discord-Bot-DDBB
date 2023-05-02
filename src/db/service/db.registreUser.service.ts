import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, RegistreUser } from '@prisma/client';

@Injectable()
export class DBRegistreUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertRegistreUser(params: {
    where: Prisma.RegistreUserWhereUniqueInput;
    data: Prisma.RegistreUserCreateInput;
  }): Promise<RegistreUser> {
    const { where, data } = params;
    return this.prismaService.registreUser.upsert({
      where: {
        registreUserServerId: where.registreUserServerId,
      },
      update: {},
      create: {
        userId: where.registreUserServerId.userId,
        serverId: where.registreUserServerId.serverId,
      },
    });
  }
}
