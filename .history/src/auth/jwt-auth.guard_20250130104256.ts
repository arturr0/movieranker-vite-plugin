import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
      throw new Error('Token missing');
    }

    try {
      // Verify the token
      const decoded = this.jwtService.verify(token, { secret: 'your-secret-key' });
      request.user = decoded; // Attach the user data to the request object
    } catch (error) {
      throw new Error('Invalid or expired token');
    }

    return true; // Allow the request to proceed
  }
}
