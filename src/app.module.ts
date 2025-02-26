import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';  // Import MoviesModule
import { MoviesService } from './movies/movies.service';  // Import MoviesModule
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';  // Import JwtAuthGuard
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,  // Your secret key
      signOptions: { expiresIn: '1h' },  // Token expiration time
    }),
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend-vite', 'dist'),
    }),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MoviesModule,  // Ensure MoviesModule is imported here
  ],
  controllers: [],  // No need to include MoviesController here anymore
  providers: [PrismaService, JwtAuthGuard, JwtService, MoviesService],
})
export class AppModule {}
