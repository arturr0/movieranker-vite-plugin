import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';  // Adjust based on your data source

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default-secret',  // Secret key for signing the JWT
    });
  }

  async validate(payload: any) {
    // Extract user data from payload and verify existence in DB
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },  // 'sub' is the user ID in the JWT
    });
    return user;  // This attaches the user to the request
  }
}
