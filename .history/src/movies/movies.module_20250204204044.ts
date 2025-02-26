import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';  // ✅ Correct Import
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    PrismaModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService], // Register MoviesService
  exports: [MoviesService], // Export it for other modules if needed
})
export class MoviesModule {}
