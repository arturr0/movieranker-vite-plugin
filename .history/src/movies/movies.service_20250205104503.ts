import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MoviesService {
  private updatesSubject = new Subject<MessageEvent>();

  getUpdates(): Observable<MessageEvent> {
    return this.updatesSubject.asObservable();
  }

  notifyUpdate() {
    const updateData = { message: 'Database updated!' };
    this.updatesSubject.next(new MessageEvent('message', { data: JSON.stringify(updateData) }));
  }
  
}
