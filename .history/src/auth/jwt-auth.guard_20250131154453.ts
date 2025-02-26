import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/request-with-user.interface';  // Make sure this import is correct

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();  
    console.log('JwtAuthGuard executed'); // Add this log to confirm execution

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No or invalid token provided');
      throw new UnauthorizedException('No or invalid token provided');
    }

    const token = authHeader.split(' ')[1]; 
    try {
      const decoded = this.jwtService.verify(token);
      console.log('Decoded Token:', decoded); // Log to check token contents
      request.user = decoded;
      return true;
    } catch (err) {
      console.log('Invalid token:', err.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
