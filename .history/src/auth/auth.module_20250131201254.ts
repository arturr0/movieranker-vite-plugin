import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Ensure JwtModule is imported
import { JwtAuthGuard } from './jwt-auth.guard'; // Import JwtAuthGuard
import { JwtStrategy } from './jwt.strategy'; // Import JwtStrategy
import { PassportModule } from '@nestjs/passport'; // Import PassportModule
import { AuthService } from './auth.service'; // Import AuthService

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: {
        expiresIn: '1h', // Define the token expiry here
      },
    }),
  ],
  providers: [JwtAuthGuard, JwtStrategy, AuthService], // Ensure providers are correctly listed
  exports: [JwtModule, AuthService], // Export JwtModule (not JwtService) to make it available to other modules
})
export class AuthModule {}
