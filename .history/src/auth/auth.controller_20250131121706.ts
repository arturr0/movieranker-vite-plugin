import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    try {
      const result = await this.authService.register(body.email, body.password);
      return res.status(HttpStatus.CREATED).json(result); // Registration successful response
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    try {
      const result = await this.authService.login(body.email, body.password);

      // Generate JWT token from result.user if necessary, but since it's already in the result, we can use it
      const token = result.token;

      // Set the JWT token as a cookie with HttpOnly and Secure flags
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour expiration
        path: '/',
      });

      return res.status(HttpStatus.OK).json({
        message: result.message,
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }
}
