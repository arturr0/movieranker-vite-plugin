import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/request-with-user.interface';  // Make sure this import is correct

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers['authorization'];
    console.log('Authorization Header:', authHeader); // Log the authHeader

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No or invalid token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract token
    console.log('Extracted Token:', token); // Log the token

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;  // Set the decoded user data in the request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

