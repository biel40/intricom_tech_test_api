import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger UI configuration
  const config = new DocumentBuilder()
    .setTitle('Intricom Tech Test API V1')
    .setDescription('Intricom Tech Test API - Developed by Biel Borràs Serra')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'api/v1/swagger.json',
  });


  // All origins allowed CORS
  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application API is running on port: http://localhost:${process.env.PORT}`);
  console.log(`Swagger Doc UI is running on port: http://localhost:${process.env.PORT}/api/v1`);
}

bootstrap();
