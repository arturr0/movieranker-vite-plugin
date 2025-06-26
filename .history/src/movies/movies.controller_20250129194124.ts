import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { join } from 'path';
import 'dotenv/config';

@Controller('movies')
export class MoviesController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  async getMoviesPage(@Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'frontend', 'movies.html');
    console.log('Serving file:', filePath);
    return res.sendFile(filePath);
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
        searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        break;
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

      if (type === 'title') {
        const movies = results.map(movie => ({
          title: movie.title,
          movieID: movie.id,
          year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
          poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '',
        }));
        return res.json({ movies });
      } else {
        const people = results.map(person => ({
          name: person.name,
          personID: person.id,
          profile: person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '',
        }));
        return res.json({ people });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      return res.json({ error: 'Failed to fetch movies', details: error.message });
    }
  }
}