
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // Verify token and attach the user to the request
      const user = await this.jwtService.verifyAsync(token);
      request.user = user; // Add the user object to the request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
