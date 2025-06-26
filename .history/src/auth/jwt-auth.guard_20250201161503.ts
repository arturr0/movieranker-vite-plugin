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

    // Log headers for debugging
    console.log("Request Headers:", request.headers);

    // Retrieve the Authorization header and ensure it's a string
    const authHeader = request.headers.authorization || request.headers['Authorization'];
    const authHeaderStr = Array.isArray(authHeader) ? authHeader[0] : authHeader; // Convert to string if array

    console.log("Authorization Header:", authHeaderStr);

    if (!authHeaderStr || !authHeaderStr.startsWith('Bearer ')) {
      throw new UnauthorizedException('No or invalid token provided');
    }

    // Extract the token
    const token = authHeaderStr.split(' ')[1];

    try {
      // Verify and decode the JWT token
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Attach decoded user to the request object

      console.log("Decoded Token:", decoded);
      return true;
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
