import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';

@Module({
  imports: [],

  controllers: [MediaController],
  
  providers: [MediaService, MediaRepository, PrismaService],
})
export class MediaModule {}