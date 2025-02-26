import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default-secret',  // Your JWT secret
    });
  }

  async validate(payload: any) {
    // Make sure to check the user in your DB based on the payload (e.g., payload.sub)
    return { userId: payload.sub };  // Attach user data to the request
  }
}