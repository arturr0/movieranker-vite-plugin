import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { join } from 'path';
import 'dotenv/config';

@Controller('movies')
export class MoviesController {
  constructor(private readonly httpService: HttpService) {}

  // Serve the movies.html file
  @Get()
  async getMoviesPage(@Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'frontend', 'movies.html');
    console.log('Serving file:', filePath);  // Check if the path is correct
    return res.sendFile(filePath);
  }

  // Search for movies via OMDb API
  @Get('search')
  async searchMovies(@Query('title') title: string, @Res() res: Response) {
    const apiKey = process.env.API_KEY;  // Ensure you have the correct API key in your .env file
    const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(title)}`;

    try {
      const response = await firstValueFrom(this.httpService.get(apiUrl));
      
      // Check if the response is valid
      if (response.data.Response === 'True') {
        const moviesWithPosters = response.data.Search.map(movie => ({
          title: movie.Title,
          year: movie.Year,
          poster: movie.Poster,  // Add the movie poster URL to the result
          imdbID: movie.imdbID
        }));
        return res.json({ movies: moviesWithPosters });
      } else {
        return res.json({ error: 'No results found for the given title' });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      return res.json({ error: 'Failed to fetch movies', details: error.message });
    }
  }
}
