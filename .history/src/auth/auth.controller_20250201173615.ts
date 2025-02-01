import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }, @Res() res: Response) {
    try {
      // Register the user and get the result which includes the token
      const result = await this.authService.register(body.email, body.password);

      if (result.token) {
        // Send JWT token after successful registration
        return res.status(HttpStatus.CREATED).json({
          message: 'User registered successfully',
          token: result.token,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User registration failed',
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    try {
      const result = await this.authService.login(body.email, body.password);

      return res.status(HttpStatus.OK).json({
        message: result.message,
        token: result.token,  // Send JWT token
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }
}
