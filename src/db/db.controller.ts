import { Controller, Post, Req, Get, Body, Query, Param } from '@nestjs/common';
import { DBUserService } from './service/db.user.service';
import { User } from '@prisma/client';

@Controller('db')
export class DBController {
  constructor(private readonly dbUserService: DBUserService) {}

  async createUser(data): Promise<User> {
    return this.dbUserService.createUser(data);
  }
}
