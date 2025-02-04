import {
  Controller,
  Get,
  Query,
  Res,
  Req,
  UseGuards,
  Post,
  Body,
  Sse,
} from '@nestjs/common';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { MoviesService } from './movies.service';  // ✅ Correct Import

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly moviesService: MoviesService, // Injecting SSE Service
  ) {}

  @Get()
  async getMoviesPage(@Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'frontend', 'movies.html');
    console.log('Serving file:', filePath);
    return res.sendFile(filePath);
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: RequestWithUser, @Res() res: Response) {
    console.log('User:', req.user);
    return res.json({
      message: 'This is a protected movies route',
      user: req.user,
    });
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

      if (type === 'title') {
        const movies = await Promise.all(results.map(async (movie) => {
          const ratings = await this.prisma.ratingMovie.findMany({
            where: { tmdbId: movie.id },
            select: {
              rating: true,
              userId: true,
              userEmail: true,
              comment: true,
            },
          });

          return {
            title: movie.title,
            year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '',
            id: movie.id,
            ratings,
          };
        }));
        return res.json({ movies });
      } else {
        const people = await Promise.all(results.map(async (person) => {
          const ratings = await this.prisma.ratingPerson.findMany({
            where: { tmdbId: person.id },
            select: {
              rating: true,
              userId: true,
              userEmail: true,
              comment: true,
            },
          });

          return {
            name: person.name,
            profile: person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '',
            id: person.id,
            ratings,
          };
        }));
        return res.json({ people });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      return res.json({ error: 'Failed to fetch movies', details: error.message });
    }
  }

  @Post('rate')
  @UseGuards(JwtAuthGuard)
  async rateItem(
    @Req() req: RequestWithUser,
    @Body() body: { type: string; id: number; title: string; rating: number; post: string },
  ) {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const { type, id, title, rating, post } = body;

    try {
      let ratingRecord;

      if (type === 'movie') {
        ratingRecord = await this.prisma.ratingMovie.upsert({
          where: { userId_tmdbId: { userId, tmdbId: id } },
          update: { rating, comment: post },
          create: {
            userId,
            userEmail,
            tmdbId: id,
            title,
            rating,
            comment: post,
          },
        });
      } else if (type === 'person') {
        ratingRecord = await this.prisma.ratingPerson.upsert({
          where: { userId_tmdbId: { userId, tmdbId: id } },
          update: { rating, comment: post },
          create: {
            userId,
            userEmail,
            tmdbId: id,
            title,
            rating,
            comment: post,
          },
        });
      } else {
        return { success: false, error: 'Invalid type specified' };
      }

      return { success: true, ratingRecord };
    } catch (error) {
      console.error('Error saving rating:', error);
      return { success: false, error: error.message };
    }
  }

  /** SSE Route for Live Updates **/
  @Get('updates')
  @Sse()
  sendUpdates(): Observable<any> {
    return this.moviesService.getUpdates();
  }
}
