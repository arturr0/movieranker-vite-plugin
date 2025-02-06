import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
	@Get()
	@UseGuards(JwtAuthGuard)
	getProtectedData(@Req() req) {
		return { 
			message: 'This is a protected route', 
			user: req.user  // Returns the decoded JWT payload
		};
	}
}
