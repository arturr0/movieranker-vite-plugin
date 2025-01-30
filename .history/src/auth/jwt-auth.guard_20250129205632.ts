import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JwtAuthGuard uses Passport strategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
