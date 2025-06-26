import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    try {
      const result = await this.authService.login(body.email, body.password);

      // Generate JWT token from result.user if necessary, but since it's already in the result, we can use it
      const token = result.token; // The token is already included in the result object

      // Set the JWT token as a cookie with HttpOnly and Secure flags
      res.cookie('jwt', token, {
        httpOnly: true,  // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production',  // Ensures cookies are sent over HTTPS only in production
        maxAge: 3600000,  // 1 hour expiration
        path: '/',  // Cookie is available for the whole domain
      });

      return res.status(HttpStatus.OK).json({
        message: result.message, // Respond with a success message
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }
}
