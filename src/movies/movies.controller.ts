import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('movies')
export class MoviesController {
  @Get()
  async getMoviesPage(@Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'frontend', 'movies.html');
    console.log('Serving file:', filePath);  // Check if the path is correct
    return res.sendFile(filePath);
  }
}
