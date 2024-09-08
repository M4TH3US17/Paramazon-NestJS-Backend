import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [],

  controllers: [UserController],
  
  providers: [UserService, UserRepository, PrismaService],
})
export class UserModule {}