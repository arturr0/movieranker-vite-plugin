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
    // console.log('Received Headers:', request.headers);
  
    // const authHeader = request.headers.authorization || request.headers['Authorization'];
    // console.log('Extracted Authorization Header:', authHeader); // Should log the token
  
    // if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    //   throw new UnauthorizedException('No or invalid token provided');
    // }
  
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM1LCJlbWFpbCI6ImFqampqampqampqampqampqYWFmZmZmZmZAZ21haWwuY29tIiwiaWF0IjoxNzM4NDMxMTM4LCJleHAiOjE3Mzg0MzQ3Mzh9.ij_EY_ZKpovlQtgaceUs7HA9r-XE1QXUmBh3SRe6-dc";
  
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

