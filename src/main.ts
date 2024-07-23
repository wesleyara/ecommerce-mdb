import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const PORT = process.env.PORT || 3333;

  await app.listen(PORT);
}
bootstrap();
