import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.SERVER_PORT;
  const host = process.env.SERVER_HOST;

  const app = await NestFactory.create(AppModule);
  //const configService = app.get(ConfigService);

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

  await app.listen(port || 3000);

  //console.log(`>>> Development environment? ${environmentProfile ? 'yes' : 'no'}`);
  console.log(`>>> Application running at: http://${host || 'localhost'}:${port || 3000}`);
  console.log(`>>> Swagger URI: http://${host || 'localhost'}:${port || 3000}/api`);
}

bootstrap();
