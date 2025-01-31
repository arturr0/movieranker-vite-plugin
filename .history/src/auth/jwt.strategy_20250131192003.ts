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
    console.log('JWT Payload:', payload); // Log the entire payload to check its structure
    return { id: payload.id, email: payload.email }; // Ensure these fields exist in the payload
  }
  
  
}
