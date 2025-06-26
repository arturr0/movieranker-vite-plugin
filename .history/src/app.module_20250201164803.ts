import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';  // Make sure it's imported
import { PrismaService } from './prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';
import { MoviesController } from './movies/movies.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // Import JwtAuthGuard
import { JwtService } from '@nestjs/jwt'; // Import JwtService if needed
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Your secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
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
  providers: [PrismaService, JwtAuthGuard, JwtService],
})
export class AppModule {}
