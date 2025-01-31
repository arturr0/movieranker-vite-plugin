import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }, @Res() res: Response) {
    try {
      const user = await this.authService.register(body.email, body.password);
      const token = this.authService.generateToken(user);  // ✅ Now `user` has id and email

      return res.status(HttpStatus.CREATED).json({
        message: 'User registered successfully',
        token,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message || 'Registration failed',
      });
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    try {
      const result = await this.authService.login(body.email, body.password);
      return res.status(HttpStatus.OK).json({ token: result.token });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }
  
}
