import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = () =>
  new DocumentBuilder()
    .setTitle('Hospital Management API')
    .setDescription(
      'API documentation for managing doctors, patients, appointments.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
