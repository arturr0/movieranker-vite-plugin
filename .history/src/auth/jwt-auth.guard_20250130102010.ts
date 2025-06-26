import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/request-with-user.interface'; // Import the custom interface

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();  // Use the custom RequestWithUser interface

    // Log the authorization header to debug
    const authHeader = request.headers['authorization'];
    console.log('Authorization Header:', authHeader);  // Debugging line

    // Validate the presence of the token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No or invalid token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract token from the header
    try {
      // Verify the token and log the decoded payload
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

      console.log('Decoded JWT:', decoded); // Debugging line
      request.user = decoded;  // Attach the decoded JWT payload to the request object
      return true;
    } catch (err) {
      console.error('JWT Verification Error:', err); // Log errors in the JWT verification process
      throw new UnauthorizedException('Invalid token');
    }
  }
}
