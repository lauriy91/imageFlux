import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar filtro global para gestión centralizada de errores
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuración Swagger (API First)
  const config = new DocumentBuilder()
    .setTitle('Images Process API')
    .setDescription('API REST para procesado de imágenes y consulta de tareas')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();