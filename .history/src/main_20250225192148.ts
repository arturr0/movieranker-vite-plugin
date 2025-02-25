import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000; // Use Render's provided port

if (import.meta.env.PROD) { // Check if the app is in production
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(PORT);
    console.log(`Server running on http://localhost:${PORT}`);
  }
  bootstrap();
}

export const viteNodeApp = NestFactory.create(AppModule); // Export for Vite SSR
