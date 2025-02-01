import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  
    // Generate JWT token after user creation
    const token = this.jwtService.sign({ id: user.id, email: user.email });
  
    return { message: 'User registered successfully', token }; // Return token
  }
  

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return { message: 'Login successful', token };
  }
}
