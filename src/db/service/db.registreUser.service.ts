import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, RegistreUser } from '@prisma/client';

@Injectable()
export class DBRegistreUser {
  constructor(private readonly prismaService: PrismaService) {}

  async createRegistreUser(
    data: Prisma.RegistreUserCreateInput,
  ): Promise<RegistreUser> {
    return this.prismaService.registreUser.create({
      data,
    });
  }
}
