import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // En prod FRONTEND_URL viene del .env / docker-compose
  // En dev queda el fallback de localhost:5173
  const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  await app.listen(3008);
}
bootstrap();