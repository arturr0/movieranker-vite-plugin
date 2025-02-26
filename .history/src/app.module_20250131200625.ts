import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module'; // Movies module
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // Import JwtAuthGuard
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD to register the global guard

@Module({
  imports: [
    AuthModule, // Ensure AuthModule provides JwtService and JwtAuthGuard
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'), // This is correct before the build process
    }),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables accessible throughout the app
    }),
    MoviesModule, // MoviesModule will handle MoviesController automatically
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
