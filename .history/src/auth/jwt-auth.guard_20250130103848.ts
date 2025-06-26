import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
      if (token) {
        try {
          // Decode the token and add the user to the request
          const decoded = this.jwtService.verify(token, { secret: 'your-secret-key' });
          request.user = decoded; // Save the decoded JWT as user data in the request
        } catch (e) {
          throw new Error('Invalid or expired token');
        }
      }
    }
    return super.canActivate(context);
  }
}
