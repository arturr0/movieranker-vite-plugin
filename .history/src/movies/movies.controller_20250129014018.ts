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
    console.log('Serving file:', filePath); // Check if the path is correct
    return res.sendFile(filePath);
  }

  // Search for movies by actor using OMDb API
  @Get('search')
  async searchMovies(@Query('actor') actor: string, @Res() res: Response) {
    const apiKey = process.env.API_KEY; // Ensure API key is set in .env
    const searchUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(actor)}&type=movie`;

    try {
      const searchResponse = await firstValueFrom(this.httpService.get(searchUrl));

      if (searchResponse.data.Response === 'True') {
        // Fetch detailed data for each movie and filter by actor
        const movies = await Promise.all(
          searchResponse.data.Search.map(async (movie) => {
            const detailsUrl = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
            const detailsResponse = await firstValueFrom(this.httpService.get(detailsUrl));

            if (detailsResponse.data.Actors && detailsResponse.data.Actors.includes(actor)) {
              return {
                title: detailsResponse.data.Title,
                year: detailsResponse.data.Year,
                poster: detailsResponse.data.Poster,
                imdbID: detailsResponse.data.imdbID,
              };
            }
            return null;
          })
        );

        const filteredMovies = movies.filter((movie) => movie !== null);

        if (filteredMovies.length > 0) {
          return res.json({ movies: filteredMovies });
        } else {
          return res.json({ error: `No movies found for actor: ${actor}` });
        }
      } else {
        return res.json({ error: `No results found for actor: ${actor}` });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      return res.json({ error: 'Failed to fetch movies', details: error.message });
    }
  }
}
