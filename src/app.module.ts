import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './modules/user/entity/user.entity';
import { MediaEntity } from './modules/user/entity/media.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST') || 'localhost',
        port: parseInt(configService.get<string>('DATABASE_POR'), 10) || 5432,
        username: configService.get<string>('DATABASE_USERNAME') || 'postgres',
        password: configService.get<string>('DATABASE_PASSWORD') || 'admin',
        database: configService.get<string>('DATABASE_NAME') || 'paramazon',
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    UserModule
  ],
  providers: [],
})
export class AppModule {}
