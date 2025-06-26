import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Use PORT from the environment or default to 3000
  const port = process.env.PORT || 3000;
  app.enableCors({
    origin: 'http://localhost:3000/movies',  // You can specify a specific frontend URL here, e.g., 'http://localhost:4200'
    methods: 'GET, POST, PUT, DELETE',  // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization',  // Allowed headers
  });
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
