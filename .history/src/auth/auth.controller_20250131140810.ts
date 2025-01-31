import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

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

      // Set the JWT token as a cookie with the correct SameSite and Secure flags
      res.cookie('jwt', result.token, {
        httpOnly: true,  // Prevent client-side JavaScript access to the cookie
        secure: true,    // Ensure the cookie is sent over HTTPS (important for production)
        sameSite: 'none', // Correct value for cross-origin requests
      });

      return res.status(HttpStatus.OK).json({
        message: result.message,
        token: result.token, // Send the token as part of the response body
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
    }
  }
}
