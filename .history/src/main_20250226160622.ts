import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const PORT = process.env.NODE_ENV || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}


  bootstrap();


// Export for Vite
export const viteNodeApp = NestFactory.create(AppModule);
