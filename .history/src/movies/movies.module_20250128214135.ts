import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller'; // Import MoviesController
import { HttpModule } from '@nestjs/axios'; // Import HttpModule for API requests

@Module({
  imports: [HttpModule],  // Include HttpModule for making HTTP requests
  controllers: [MoviesController],  // Register the MoviesController
})
export class MoviesModule {}
