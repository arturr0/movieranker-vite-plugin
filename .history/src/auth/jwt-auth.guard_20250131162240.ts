import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/request-with-user.interface';  // Ensure this import is correct

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers['authorization'];

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No or invalid token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      console.log('Extracted Token:', token);
      const decoded = this.jwtService.verify(token);
      console.log('Decoded Token:', decoded);
      request.user = decoded;
      return true;
    } catch (err) {
      console.error('JWT Verification Error:', err.name, err.message);
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
