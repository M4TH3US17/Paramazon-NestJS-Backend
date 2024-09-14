import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const port = process.env.SERVER_PORT || 3000;
  const host = process.env.SERVER_HOST || 'localhost';
  const apiVersion = process.env.API_VERSION_PATH || 'api/v1';

  const app = await NestFactory.create(AppModule);

  // Configuração do HttpExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuração do ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Paramazon Backend API')
    .setDescription('Descrição da API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Inicia o servidor
  await app.listen(port);

  console.log(`>>> Application running at: http://${host}:${port}/${apiVersion}`);
  console.log(`>>> Swagger URI: http://${host}:${port}/api`);
}

bootstrap();
