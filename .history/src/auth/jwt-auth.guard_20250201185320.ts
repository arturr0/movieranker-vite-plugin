import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Define a type for requests that will have a user property
interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
  const request = context.switchToHttp().getRequest<RequestWithUser>();
  
  // Debugging: Log all headers
  console.log('Received Headers:', request.headers);

  const authHeader = request.headers.authorization || request.headers['Authorization'];
  console.log('Extracted Authorization Header:', authHeader); // Should log the token

  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('No or invalid token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = this.jwtService.verify(token);
    request.user = decoded;
    return true;
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    throw new UnauthorizedException('Invalid token');
  }
}

}

