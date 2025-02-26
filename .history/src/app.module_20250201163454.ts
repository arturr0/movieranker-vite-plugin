import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';  // Make sure it's imported
import { PrismaService } from './prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { MoviesController } from './movies/movies.controller';

@Module({
  imports: [
    AuthModule,  // AuthModule should be imported here
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,  // Makes environment variables globally available
    }),
    MoviesModule,
  ],
  controllers: [MoviesController],
  providers: [PrismaService],
})
export class AppModule {}
