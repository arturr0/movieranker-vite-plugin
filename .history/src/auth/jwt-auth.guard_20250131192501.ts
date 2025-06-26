import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/request-with-user.interface';  // Make sure this import is correct

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    
    console.log('Request Headers:', request.headers); // Log all headers
    const authHeader = request.headers['authorization'];
    
    console.log('Authorization Header:', authHeader); // Log Authorization header specifically
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No or invalid token provided');
      throw new UnauthorizedException('No or invalid token provided');
    }
    
    const token = authHeader.split(' ')[1]; // Extract token
    try {
      const decoded = this.jwtService.verify(token); // Decode and verify token
      console.log('Decoded JWT:', decoded);
      request.user = decoded; // Attach user to request
      return true;
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
  
  
  
  
  
  
}
