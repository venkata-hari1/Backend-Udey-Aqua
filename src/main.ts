import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: ['http://localhost:5173', 'http://localhost:5174']})
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({whitelist:true,transform:true,forbidNonWhitelisted:true}))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
