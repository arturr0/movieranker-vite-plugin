// src/auth/request-with-user.interface.ts
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: any; // Define the `user` property as any or with a specific type
}
