import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MoviesService {
    private clients = new Map<number, Subject<any>>();

    subscribe(userId: number): Observable<any> {
		if (!this.clients.has(userId)) {
			this.clients.set(userId, new Subject<any>());
		}
		
		console.log(`✅ User ${userId} subscribed to SSE. Active Clients:`, Array.from(this.clients.keys()));
	
		return this.clients.get(userId)!.asObservable();
	}
	

    notifyUpdate(queryType: string, queryText: string, querySenderID: number) {
        console.log(`🔹 Sending SSE update | User: ${querySenderID} | Type: ${queryType} | Text: ${queryText}`);
        
        console.log(`📡 Current SSE clients:`, Array.from(this.clients.keys()));

        this.clients.forEach((subject, userId) => {
			console.log(`📡 Sending SSE update to user ${userId}:`, { queryType, queryText, querySenderID });
			subject.next({ queryType, queryText, querySenderID });
		});
    }
}
