import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';  // Import HttpService
import { firstValueFrom } from 'rxjs';

@Controller('movies')
export class MoviesController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: RequestWithUser) {
    console.log('User:', req.user);  // Logs the user info from the token
    return 'This is a protected movies route';
  }

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('type') type: string,
    @Res() res: Response
  ) {
    const apiKey = process.env.TMDB_API_KEY;
    let searchUrl = '';
    switch (type) {
      case 'actor':
      case 'director':
        searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        break;
      default:
        searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    }

    try {
      const searchResponse = await firstValueFrom(this.httpService.get(searchUrl));
      const results = searchResponse.data.results;
      if (!results || results.length === 0) {
        return res.json({ error: `No results found for ${type}: ${query}` });
      }
      return res.json(type === 'title' ? { movies: results } : { people: results });
    } catch (error) {
      console.error('Error fetching movies:', error);
      return res.json({ error: 'Failed to fetch movies', details: error.message });
    }
  }
}
