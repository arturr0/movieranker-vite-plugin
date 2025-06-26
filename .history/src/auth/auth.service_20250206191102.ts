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

    // Method to find a user by email
    async findUserByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async register(email: string, password: string) {
        // Check if the user already exists
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new UnauthorizedException('Account already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        
        // Generate JWT token after registration
        const token = this.jwtService.sign({ id: user.id, email: user.email });
        
        return { message: 'User registered successfully', token };  // Return token along with the message
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid email or password');
        }
        
        // Generate JWT token after successful login
        const token = this.jwtService.sign({ id: user.id, email: user.email });
        
        return { message: 'Login successful', token };
    }
}

