import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './database/prisma/prisma.module';
import { MediaModule } from './modules/medias/media.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    UserModule,
    MediaModule,
    PrismaModule,
  ],
  providers: [],
})
export class AppModule { }
