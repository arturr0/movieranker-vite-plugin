import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/request-with-user.interface';  // Make sure this import is correct

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    console.log('request', request.headers);  // Using the extended Request interface
    const authHeader = request.headers['authorization'];
    console.log('authHeader', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No or invalid token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract token
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;  // Now TypeScript will not complain about missing 'user'
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
