import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [AuthModule, ConfigModule.forRoot(), ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'frontend'), // Path to the folder containing your HTML
  })], // Import AuthModule for authentication functionality
  providers: [PrismaService], // Make PrismaService globally available
  exports: [PrismaService],   // Export PrismaService for use in other modules
})
export class AppModule {}
