import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class MoviesService {
  private updates = new Subject<any>();

  sendUpdate(data: any) {
    this.updates.next(data);
  }

  getUpdates(): Observable<any> {
    return this.updates.asObservable();
  }
}
