import { RequestWithUser } from '../../auth/request-with-user.interface';

declare global {
  namespace Express {
    interface Request extends RequestWithUser {}
  }
}
