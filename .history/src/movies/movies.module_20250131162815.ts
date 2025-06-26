import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';  // ✅ AuthModule should provide JwtService

@Module({
  imports: [
    HttpModule,  // ✅ For making HTTP requests
    AuthModule,  // ✅ Import AuthModule to get JwtService
  ],
  controllers: [MoviesController],
  providers: [],  // ✅ Add MoviesService here if needed
})
export class MoviesModule {}
