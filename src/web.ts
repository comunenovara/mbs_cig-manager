import { Server, createServer } from 'http';
import { PORT } from './app';
import { Rest } from './rest';
import { Socket } from './socket';

export class Web {
	
	async start() {
		let rest = new Rest();
		await rest.init();
		
		const http = createServer(rest.getExpress());
		
		const socket = new Socket(http);

		const server = http.listen(PORT, function () {
			console.log("listening on *:" + PORT);
		});
	}
}