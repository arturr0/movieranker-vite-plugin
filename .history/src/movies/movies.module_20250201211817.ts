import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';  // Import MoviesController
import { HttpModule } from '@nestjs/axios';  // Import HttpModule for HTTP requests
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule for JwtService
import { AuthModule } from '../auth/auth.module';  // Import AuthModule for authentication
import { PrismaModule } from '../prisma/prisma.module';  // Import PrismaModule to access PrismaService

@Module({
  imports: [
    HttpModule,  // Ensure HttpModule is included here
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',  // Ensure correct JWT secret from environment
      signOptions: { expiresIn: '1h' },  // JWT expiration
    }),
    AuthModule,  // Ensure that the AuthModule is also imported if it provides any services needed
    PrismaModule,  // Import PrismaModule to use PrismaService
  ],
  controllers: [MoviesController],  // Register MoviesController here
  providers: [],  // Add providers if necessary for services
})
export class MoviesModule {}
