import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';  // Importing JwtModule
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import 'dotenv/config'; // Loading environment variables

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',  // Ensure JWT secret is correctly set
      signOptions: { expiresIn: '1h' },  // JWT expiration
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],  // Exporting JwtAuthGuard if needed outside this module
})
export class AuthModule {}
