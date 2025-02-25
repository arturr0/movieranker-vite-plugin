import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);
}

bootstrap();

// Export for Vite SSR (if needed)
export const viteNodeApp = NestFactory.create(AppModule); // Properly place the export
