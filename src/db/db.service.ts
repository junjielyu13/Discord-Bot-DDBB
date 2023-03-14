import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { User as UserModel, Post as PostModel, Prisma } from '@prisma/client';

export class DBService {
  constructor(private readonly prismaService: PrismaService) {}

  async addUser(): Promise<any> {
    // return this.prismaService.user.create({
    //   data: {
    //     name: '9999999999999',
    //     email: '99999999999999999999',
    //   },
    // });
  }
}
