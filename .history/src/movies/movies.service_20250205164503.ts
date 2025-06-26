import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class MoviesService {
private updates = new Subject<any>();

getUpdates() {
	return this.updates.asObservable();
}

notifyUpdate(type: string, title: string, queryType: string, queryText: string, querySenderID: number) {
    console.log(`Sending SSE update: ${type} - ${title} - ${queryType} - ${queryText} - ${querySenderID}`);
    this.updates.next({ type, title, queryType, queryText, querySenderID });
}

}
