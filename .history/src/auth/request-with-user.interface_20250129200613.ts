import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: { id: number; email: string }; // Adjust fields based on your JWT payload
}
