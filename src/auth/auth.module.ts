import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module'; // Adjust the path as necessary

@Module({
  imports: [PrismaModule],
  providers: [AuthService],
})
export class AuthModule {}
