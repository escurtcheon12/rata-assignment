import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //--- Setup Server ---//
  console.log('//-------------- Setup Auth Service (GraphQL) --------------//');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });
  app.useGlobalPipes(new ValidationPipe());

  console.log('GraphQL Endpoints Registered:');

  return app;
}

async function startServer() {
  const app = await bootstrap();
  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 Auth Service (GraphQL) running on port: ${port}`, 'Bootstrap');
  Logger.log(
    `📊 GraphQL Playground: http://localhost:${port}/graphql`,
    'Bootstrap',
  );
}

startServer();
