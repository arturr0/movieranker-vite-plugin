import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: any; // You can specify a more precise type based on your JWT payload
}
