import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MoviesService {
    private updates = new Subject<any>();

    getUpdates() {
        return this.updates.asObservable();
    }

    notifyUpdate(queryType: string, queryText: string, querySenderID: number) {
        console.log(`Sending SSE update: ${queryType} - ${queryText} - ${querySenderID}`);
        this.updates.next({ queryType, queryText, querySenderID });
    }
}