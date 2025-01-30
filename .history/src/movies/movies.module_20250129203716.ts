import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';  // Import MoviesController
import { HttpModule } from '@nestjs/axios';  // Import HttpModule for API requests
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule for JwtService
import { AuthModule } from '../auth/auth.module';  // Import AuthModule if JwtService is provided there

@Module({
  imports: [
    HttpModule,  // Include HttpModule for making HTTP requests
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',  // Make sure you use the correct secret from env variables
      signOptions: { expiresIn: '1h' },  // JWT expiration
    }),
    AuthModule,  // Import AuthModule if JwtService is provided there
  ],
  controllers: [MoviesController],  // Register the MoviesController
  providers: [],  // Add any providers needed for this module, e.g., MoviesService or guards
})
export class MoviesModule {}
