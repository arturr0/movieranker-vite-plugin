import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log("Request Headers:", request.headers);  // Log all headers to check if Authorization is present
    const authHeader = request.headers.authorization;
    console.log('Authorization Header:', authHeader);  // Debug log the Authorization header
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }
  
    const token = authHeader.split(' ')[1];  // Extract token
    console.log('Extracted Token:', token);  // Log the extracted token for debugging
  
    try {
      const user = await this.jwtService.verifyAsync(token);  // Verify token
      request.user = user;  // Attach user to request
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  
}
