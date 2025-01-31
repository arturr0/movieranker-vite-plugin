import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(email: string, password: string) {
    const newUser = { id: Date.now(), email };  // ✅ Ensure correct user structure
    return newUser;  // ✅ Return a proper user object
  }

  async login(email: string, password: string) {
    const user = { id: 1, email };  // ✅ Ensure correct structure

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { message: 'Login successful', token };
  }

  generateToken(user: { id: number; email: string }) {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}

