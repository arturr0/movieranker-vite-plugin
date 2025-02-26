import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000; // Use the actual port variable

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}

bootstrap();

// Export for Vite (if you need to use it for server-side rendering or other purposes)
export const viteNodeApp = NestFactory.create(AppModule)
  .then(app => app.listen(PORT)); // Make sure the app listens on the port
