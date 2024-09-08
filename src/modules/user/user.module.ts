import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { MediaEntity } from './entity/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, MediaEntity])],

  controllers: [UserController],
  
  providers: [UserService],
})
export class UserModule {}