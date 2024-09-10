import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('SERVER_PORT');
  const host = configService.get<number>('SERVER_HOST'); 
  const environmentProfile = configService.get<number>('APPLICATION_DEV_ENVIRONMENT');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Paramazon API')
    .setDescription('')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  console.log(`>>> Development environment? ${environmentProfile ? 'yes' : 'no'}`);
  console.log(`>>> Application running at: http://${host}:${port}`);
  console.log(`>>> Swagger URI: http://localhost:${port}/api`);
}

bootstrap();
