import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  // app.enableCors({
  //   origin: 'http://localhost:3000', // puerto diferente segun tecnologia de uso de frontend
  //   credentials: true,
  // });
  
  await app.listen(3000);
}
bootstrap();
