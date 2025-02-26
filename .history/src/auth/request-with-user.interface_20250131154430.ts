import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: { userId: string };  // Ensure this matches your JWT payload
}
