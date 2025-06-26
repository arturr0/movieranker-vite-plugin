import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
async register(@Body() body: { email: string; password: string }, @Res() res: Response) {
  try {
    const result = await this.authService.register(body.email, body.password);

    return res.status(HttpStatus.CREATED).json({
      message: result.message,
      token: result.token, // Send JWT token in response
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
}


@Post('login')
async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
  try {
    const result = await this.authService.login(body.email, body.password);

    return res.status(HttpStatus.OK).json({
      message: result.message,
      jwt: result.token,  // Change from "token" to "jwt" to match frontend expectation
    });
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
  }
}

}
