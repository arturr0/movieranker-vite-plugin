import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class MoviesService {
  private updates = new Subject<any>();

  getUpdates() {
    return this.updates.asObservable();
  }

  notifyUpdate(type: string, title: string) {
    console.log(`Sending SSE update: ${type} - ${title}`);
    this.updates.next({ type, title });
  }
  
}
