// src/types/express/index.d.ts
import { RequestWithUser } from '../../auth/request-with-user.interface';

declare global {
  namespace Express {
    // Augment the global Express namespace only when necessary
    interface Request extends RequestWithUser {}
  }
}
