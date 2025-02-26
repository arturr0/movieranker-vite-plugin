import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // Ensure this is injected correctly
  ) {}

  async generateToken(userId: string) {
    return this.jwtService.sign({ userId });
  }
}
