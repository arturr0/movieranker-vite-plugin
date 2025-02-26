import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    // Ensure there's an Authorization header
    if (!authHeader) throw new UnauthorizedException('No token provided');
    
    // Extract the token from the header (Bearer <token>)
    const token = authHeader.split(' ')[1];
    
    // If no token is found after splitting, throw error
    if (!token) throw new UnauthorizedException('No token provided');
    
    try {
      // Verify the token and attach the user to the request
      request.user = this.jwtService.verify(token);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
