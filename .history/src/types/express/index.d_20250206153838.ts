// src/types/express/index.d.ts
import { RequestWithUser } from '../../auth/request-with-user.interface';

declare global {
	namespace Express {
		// We don't extend RequestWithUser here, just directly augment the Request type
		interface Request {
			user?: any;  // Directly augment `Request` with the `user` property
		}
	}
}
