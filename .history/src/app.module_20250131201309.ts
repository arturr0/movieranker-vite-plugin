import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; // Import AuthModule
import { PrismaService } from './prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module'; // Movies module
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // Import JwtAuthGuard
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD

@Module({
  imports: [
    AuthModule, // Import AuthModule to ensure JwtService is available
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'), // Correct path before build
    }),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables accessible throughout the app
    }),
    MoviesModule, // MoviesModule handles MoviesController automatically
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Register JwtAuthGuard globally
    },
  ],
})
export class AppModule {}
