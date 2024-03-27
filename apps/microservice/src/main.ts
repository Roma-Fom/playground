import { NestFactory } from '@nestjs/core';
import { MicroserviceModule } from './microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(MicroserviceModule);
  await app.listen(3200);
}
bootstrap();
