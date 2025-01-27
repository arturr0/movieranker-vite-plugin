import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule], // Import AuthModule for authentication functionality
  providers: [PrismaService], // Make PrismaService globally available
  exports: [PrismaService],   // Export PrismaService for use in other modules
})
export class AppModule {}
