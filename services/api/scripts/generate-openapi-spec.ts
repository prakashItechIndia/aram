import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../src/app.module';

async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error'],
  });

  const config = new DocumentBuilder()
    .setTitle('Aram API')
    .setDescription('The Aram API description')
    .setVersion('1.0')
    .addTag('aram')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outputPath = path.join(__dirname, '..', 'openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log('✅ OpenAPI spec generated at: ' + outputPath);
  await app.close();
}

generateOpenApiSpec();
