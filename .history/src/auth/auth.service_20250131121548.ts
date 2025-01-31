import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // Make sure to import JwtService

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, // Inject JwtService for token creation
  ) {}

  // Example login method
  async login(email: string, password: string) {
    // Authenticate the user (e.g., query your database to find the user)
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    // Create JWT token
    const token = this.jwtService.sign({ id: user.id, email: user.email });

    // Return an object containing the token and the user information
    return {
      message: 'Login successful',
      token: token,
      user: user, // Ensure the user is returned here
    };
  }

  // Example method to find user (replace this with actual logic)
  private async findUserByEmail(email: string) {
    // Mock user for example, replace with actual DB query
    return {
      id: 1,
      email: email,
      password: 'hashed-password',
    };
  }
}
