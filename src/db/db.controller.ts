import { Controller, Post, Req, Get, Body, Query, Param } from '@nestjs/common';
import { DBService } from './db.service';

@Controller('db')
export class DBController {
  constructor(private readonly dbService: DBService) {}

  async createUser(data): Promise<any> {
    return this.dbService.createUser(data);
  }
}
