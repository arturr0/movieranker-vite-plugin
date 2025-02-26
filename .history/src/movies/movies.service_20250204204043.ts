import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class MoviesService {
  private updates = new Subject<any>(); // Observable stream for SSE

  // Emit new updates to subscribers
  sendUpdate(data: any) {
    this.updates.next(data);
  }

  // Return observable for SSE
  getUpdates(): Observable<any> {
    return this.updates.asObservable();
  }
}
