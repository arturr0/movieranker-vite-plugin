import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Load environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'fallback-secret'), // ✅ Use .env secret or fallback
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  exports: [JwtModule], // ✅ Ensure JwtService is available globally
})
export class AuthModule {}
