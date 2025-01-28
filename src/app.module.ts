import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MoviesController } from './movies/movies.controller';

@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'), // This is correct before the build process
    }),
  ],
  controllers: [MoviesController],
  providers: [PrismaService],
})
export class AppModule {}
