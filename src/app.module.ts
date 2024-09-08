import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './database/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    UserModule,
    PrismaModule,
  ],
  providers: [],
})
export class AppModule {}
