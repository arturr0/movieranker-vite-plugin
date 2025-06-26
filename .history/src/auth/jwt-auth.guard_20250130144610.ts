import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    //const authHeader = request.headers['authorization'];
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  throw new UnauthorizedException('Invalid Authorization header format');
}

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1]; // Get token from 'Bearer <token>'

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const user = this.jwtService.verify(token);
      request.user = user; // Add user info to request for further use
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
