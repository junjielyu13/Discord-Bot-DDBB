import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Temps } from '@prisma/client';

@Injectable()
export class DBTempsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Prisma.TempsCreateInput): Promise<Temps> {
    return this.prismaService.temps.create({
      data,
    });
  }
}
