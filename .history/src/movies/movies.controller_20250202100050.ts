import { Controller, Get, Query, Res, Req, UseGuards, Post, Body } from '@nestjs/common';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';  // Import HttpService
import { firstValueFrom } from 'rxjs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';  // Import PrismaService

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService  // Inject PrismaService here
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
      user: req.user,  // Send user data in the response
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
          select: { rating: true, userId: true, userEmail: true },
        });

        return {
          title: movie.title,
          year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
          poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '',
          id: movie.id,
          ratings, // Return all ratings instead of just one
        };
      }));
      return res.json({ movies });
    } else {
      const people = await Promise.all(results.map(async (person) => {
        const ratings = await this.prisma.ratingPerson.findMany({
          where: { tmdbId: person.id },
          select: { rating: true, userId: true, userEmail: true },
        });

        return {
          name: person.name,
          profile: person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '',
          id: person.id,
          ratings, // Return all ratings instead of just one
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
    @Body() body: { type: string, id: number, title: string, rating: number },
  ) {
    const userId = req.user.id;
    const { type, id, title, rating } = body;

    let ratingRecord;

    if (type === 'movie') {
      ratingRecord = await this.prisma.ratingMovie.upsert({
        where: { userId_tmdbId: { userId, tmdbId: id } },
        update: { rating, comment: `Rated ${title}` },
        create: {
          userId,
          userEmail: req.user.email,
          tmdbId: id,
          title,
          rating,
          comment: `Rated ${title}`,
        },
      });
    } else if (type === 'person') {
      ratingRecord = await this.prisma.ratingPerson.upsert({
        where: { userId_tmdbId: { userId, tmdbId: id } },
        update: { rating, comment: `Rated ${title}` },
        create: {
          userId,
          userEmail: req.user.email,
          tmdbId: id,
          title,
          rating,
          comment: `Rated ${title}`,
        },
      });
    }

    return { success: true, ratingRecord };
  } 
}
