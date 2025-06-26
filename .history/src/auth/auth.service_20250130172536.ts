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

  // Register method for new users
  async register(email: string, password: string) {
    // Check if the user with the given email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
  
    if (existingUser) {
      throw new Error('Email is already registered');
    }
  
    // If not, hash the password and create the new user
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  
    return { message: 'User registered successfully' };
  }
  

  // Login method for existing users
  async login(email: string, password: string): Promise<{ message: string; token: string }> {
    // Find the user by email
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token with user ID and email
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    console.log("token", token);
    return { message: 'Login successful', token };
  }
}
