import { Server, createServer } from 'http';
import { PORT } from './app';
import { Rest } from './rest';
import { Socket } from './socket';

export class Web {
	private http: Server;

	constructor() {
		let rest = new Rest();
		this.http = createServer(rest.getExpress());
		let socket = new Socket(this.http);
	}

	start() {
		const server = this.http.listen(PORT, function() {
			console.log("listening on *:" + PORT);
		});
	}
}