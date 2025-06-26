import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
async register(@Body() body: { email: string; password: string }, @Res() res: Response) {
  try {
    await this.authService.register(body.email, body.password);
    return res.status(HttpStatus.CREATED).json({
      message: 'User registered successfully. Please log in.',
    });
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
