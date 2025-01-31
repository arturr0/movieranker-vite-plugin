import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('Request Headers:', request.headers); // Debugging line
  
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
  
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Received Authorization Header:', authHeader); // Debugging line
      throw new UnauthorizedException('Invalid Authorization header format');
    }
  
    const token = authHeader.split(' ')[1]; // Extract the token
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }
  
    try {
      const user = this.jwtService.verify(token);
      request.user = user; // Attach user info to request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  
}
