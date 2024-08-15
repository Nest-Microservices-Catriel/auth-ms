import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Auth Microservice');
  const app = await NestFactory.create(AppModule);
  await app.listen(3005);
  logger.log(`Auth ms running on port ${3005}`);
}
bootstrap();
