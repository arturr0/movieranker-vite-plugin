import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';  // Import MoviesController
import { HttpModule } from '@nestjs/axios';  // Import HttpModule for HTTP requests
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule for JwtService
import { AuthModule } from '../auth/auth.module';  // Import AuthModule if JwtService is provided there

@Module({
  imports: [
    HttpModule,  // Add HttpModule to your imports to make HttpService available
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',  // Ensure correct JWT secret from environment
      signOptions: { expiresIn: '1h' },  // JWT expiration
    }),
    AuthModule,  // If JwtService is provided here, make sure it's imported
  ],
  controllers: [MoviesController],  // Register MoviesController
  providers: [],  // Add providers if necessary for services
})
export class MoviesModule {}
