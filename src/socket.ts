import http from 'http';
import socketIo from 'socket.io';

export class Socket {
    private io: socketIo.Server;

    constructor(http: http.Server) {
        this.io = new socketIo.Server(http);

        this.io.use((socket, next) => this.handshake(socket, next));

        this.io.on("connection", (socket: socketIo.Socket) => this.connection(socket));
    }

    getSocket(): socketIo.Server {
        return this.io;
    }

    private connectedSocket: any = {};
    private connectedSocketList: string[] = [];

    private handshake(socket: socketIo.Socket, next: any) {
        //console.log("auth", socket.handshake.auth);
        if (1 == 1) {
            this.connectedSocket[socket.id] = socket;
            this.connectedSocketList.push(socket.id);
            next();
        } else {
            console.log("errore");
            next(new Error("invalid"));
        }
    }

    private connection(socket: socketIo.Socket) {
        console.log("Connesso:\t", socket.id);
        this.afterConnection(socket);
        
        socket.on("message", (message: MessageEvent) => this.onMessage(socket, message));
        socket.on("disconnect", () => this.onDisconnection(socket));
    }

    afterConnection(socket: socketIo.Socket) {
        setTimeout(() => {
            this.io.to(socket.id).emit("message", {
                sender: "sistema",
                type: "welcome",
                message: {
                    you: socket.id,
                    other: this.connectedSocketList
                }
            });
            this.io.emit("message", {
                sender: "sistema",
                type: "user_connected",
                message: socket.id
            });
        }, 1000)
    }

    sendToLog(content: string) {
        this.io.emit("message", content);
    }

    onMessage(socket: socketIo.Socket, message: any) {
        if(message['to'] != "all") {
            this.io.to(message['to']).emit("message", {
                sender: socket.id,
                type: "text",
                message: message['message']
            });
        } else {
            this.io.emit("message", {
                sender: socket.id,
                type: "text",
                message: message['message']
            });
        }
    }

    onDisconnection(socket: socketIo.Socket) {
        this.io.emit("message", {
            sender: "sistema",
            type: "user_disconnected",
            message: socket.id
        });
        const index = this.connectedSocketList.indexOf(socket.id);
        this.connectedSocketList.splice(index, 1);
        console.log("Disconnesso:\t", socket.id);
        this.connectedSocket[socket.id] = undefined;
    }

}