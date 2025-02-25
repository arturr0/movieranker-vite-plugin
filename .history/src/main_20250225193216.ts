import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000; // Use Render's provided port

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);
}

// Correct placement of export to avoid conflict with decorators
export const viteNodeApp = NestFactory.create(AppModule); // Export for Vite SSR
bootstrap();
