import { Injectable } from '@nestjs/common';
import { Pool, Client } from 'pg';
import { Observable } from 'rxjs';

@Injectable()
export class MoviesService {
  private pool: Pool;
  private client: Client;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/dbname',
    });

    this.client = new Client({
      connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/dbname',
    });

    this.client.connect();
    this.client.query('LISTEN table_update');
  }

  getUpdates(): Observable<any> {
    return new Observable((subscriber) => {
      this.client.on('notification', (msg) => {
        subscriber.next({ data: JSON.parse(msg.payload) });
      });
    });
  }
}
