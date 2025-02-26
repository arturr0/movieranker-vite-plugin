import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const PORT = 3000 || process.env.NODE_ENV;
if (PORT) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(PORT);
  }
  bootstrap();
}

export const viteNodeApp = NestFactory.create(AppModule);
