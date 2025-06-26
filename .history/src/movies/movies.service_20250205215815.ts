import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MoviesService {
    private updates = new Subject<{ userId: number; event: any }>();
    private clients = new Map<number, Subject<any>>();  // Track clients by userId

    // Subscribe a user to SSE updates
    subscribe(userId: number): Observable<any> {
        if (!this.clients.has(userId)) {
            this.clients.set(userId, new Subject<any>());
        }
        return this.clients.get(userId)!.asObservable();
    }

    // Send update only to the intended recipient
    notifyUpdate(queryType: string, queryText: string, querySenderID: number) {
		console.log(` [Backend] Sending SSE update | User: ${querySenderID} | Type: ${queryType} | Text: ${queryText}`);
	
		if (this.clients.has(querySenderID)) {
			this.clients.get(querySenderID)!.next({ queryType, queryText, querySenderID });
		}
	}
	
}
