// src/auth/request-with-user.interface.ts
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: any; // Adjust with the actual type of your JWT payload
}
