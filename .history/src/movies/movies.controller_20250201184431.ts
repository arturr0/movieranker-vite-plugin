import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';  // Import HttpService
import { firstValueFrom } from 'rxjs';
import { join } from 'path';
@Controller('movies')
export class MoviesController {
  @Get()
  async getMoviesPage(@Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'frontend', 'movies.html');
    console.log('Serving file:', filePath);
    return res.sendFile(filePath);
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: RequestWithUser) {
    console.log('User:', req.user);
    return { message: 'This is a protected movies route' };
  }
}
