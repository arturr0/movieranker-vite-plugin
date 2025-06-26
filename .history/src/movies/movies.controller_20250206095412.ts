import { Controller, Get, Query, Res, Req, UseGuards, Post, Body, Sse } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { MoviesService } from './movies.service';
import { RequestWithUser } from '../auth/request-with-user'; // Adjust the import path accordingly
import { map } from 'rxjs/operators';

@Controller('movies')
export class MoviesController {
constructor(
	private readonly httpService: HttpService,
	private readonly prisma: PrismaService,
	private readonly moviesService: MoviesService,
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
	@Query('id') id: number,
	@Res() res: Response
) {
	const apiKey = process.env.TMDB_API_KEY;
	let searchUrl = '';
	console.log('search');
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
		return res.json({ movies, queryType: type, queryText: query, querySenderID: id });
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
		return res.json({ people, queryType: type, queryText: query, querySenderID: id });
	}
	} catch (error) {
		console.error('Error fetching movies:', error);
		return res.json({ error: 'Failed to fetch movies', details: error.message });
	}
}

@Post('rate')
@UseGuards(JwtAuthGuard)
async rateItem(@Req() req: RequestWithUser, @Body() body, @Res() res: Response) {
    const { type, id, title, rating, post, queryType, queryText, querySenderID } = body;

    try {
        let ratingRecord;

        if (type === 'movie') {
            await this.prisma.movie.upsert({
                where: { id },
                update: {},
                create: { id, title, releaseDate: 'N/A', rating: null, posterPath: '' },
            });

            ratingRecord = await this.prisma.ratingMovie.upsert({
                where: { userEmail_tmdbId: { userEmail: req.user.email, tmdbId: id } },
                update: { rating, comment: post, userId: req.user.id },
                create: { userId: req.user.id, userEmail: req.user.email, tmdbId: id, title, rating, comment: post },
            });
        } else if (type === 'person') {
            await this.prisma.person.upsert({
                where: { id },
                update: {},
                create: { id, name: title, biography: '', profilePath: '' },
            });

            ratingRecord = await this.prisma.ratingPerson.upsert({
                where: { userEmail_tmdbId: { userEmail: req.user.email, tmdbId: id } },
                update: { rating, comment: post, userId: req.user.id },
                create: { userId: req.user.id, userEmail: req.user.email, tmdbId: id, title, rating, comment: post },
            });
        } else {
            return res.json({ success: false, error: 'Invalid type specified' });
        }

        // ✅ Only notify SSE AFTER ensuring database update is successful
        process.nextTick(() => {
            this.moviesService.notifyUpdate(queryType, queryText, querySenderID);
        });

        return res.json({ success: true, ratingRecord });
    } catch (error) {
        console.error('Error saving rating:', error);
        return res.json({ success: false, error: error.message });
    }
}






@Get('updates')
  async sendUpdates(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    res.flushHeaders(); // Ensure headers are sent immediately

    res.write(`data: ${JSON.stringify({ message: 'Connected to SSE' })}\n\n`);

    setInterval(() => {
      res.write(`data: ${JSON.stringify({ update: 'New movie added' })}\n\n`);
    }, 5000);
  }



}