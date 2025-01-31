import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Use PORT from the environment or default to 3000
  const port = process.env.PORT || 3000;
  app.enableCors({
    origin: 'http://localhost:3000/movies', // Allow only this domain
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization', // Allow Authorization header for JWT
    credentials: true, // Allow cookies and authentication headers
  });
  
  
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
