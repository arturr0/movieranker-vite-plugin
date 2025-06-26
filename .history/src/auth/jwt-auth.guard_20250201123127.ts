import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { RequestWithUser } from '../auth/request-with-user.interface'; // Ensure correct import

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {} // JwtService injected here

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    console.log("request.headers", request.headers);
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No or invalid token provided');
    }
    console.log("authHeader", authHeader);
    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token); // Verify the token
      request.user = decoded; // Attach user info to the request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
