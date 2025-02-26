import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private users = [
    { id: 1, email: 'test@example.com', password: 'password123' } // Replace with actual DB lookup
  ];

  async validateUser(email: string, password: string) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email };
    return {
      message: 'User logged in successfully',
      token: this.jwtService.sign(payload),
      user
    };
  }
}
